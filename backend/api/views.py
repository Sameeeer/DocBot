from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework.generics import ListAPIView

from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404

from .models import Document, ChatHistory
from .serializers import DocumentSerializer, ChatHistorySerializer

import fitz  # PyMuPDF for PDF reading

# NEW: LangChain + Embeddings + VectorStore
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings

import os

# Create folder for vector DB if it doesn't exist
VECTORSTORE_DIR = "vector_store"
os.makedirs(VECTORSTORE_DIR, exist_ok=True)

# Init embeddings & LLM
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = Ollama(model="mistral")  # Change to your installed model

class DocumentUpload(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()

            saved_path = default_storage.path(document.file.name)
            try:
                with fitz.open(saved_path) as doc:
                    text = ""
                    for page in doc:
                        text += page.get_text()

                if hasattr(document, 'text_content'):
                    document.text_content = text
                    document.save()

                # Store embeddings for this document
                Chroma.from_texts(
                    texts=[text],
                    embedding=embeddings,
                    persist_directory=VECTORSTORE_DIR
                ).persist()

            except Exception as e:
                return Response({'error': f'Failed to extract text: {str(e)}'}, status=500)

            return Response({
                'message': 'Document uploaded successfully.',
                'doc_id': document.id
            }, status=201)

        return Response(serializer.errors, status=400)


class AskQuestion(APIView):
    def post(self, request):
        doc_id = request.data.get('doc_id')
        question = request.data.get('question')

        if not doc_id or not question:
            return Response({'error': 'Both "doc_id" and "question" are required.'}, status=400)

        document = get_object_or_404(Document, id=doc_id)

        if not getattr(document, 'text_content', ''):
            return Response({'error': 'Document has no extracted text.'}, status=400)

        # Load persisted vector store
        vectorstore = Chroma(
            persist_directory=VECTORSTORE_DIR,
            embedding_function=embeddings
        )

        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=False
        )

        try:
            result = qa_chain.run(question)
        except Exception as e:
            return Response({'error': f'LLM processing failed: {str(e)}'}, status=500)

        chat = ChatHistory.objects.create(
            document=document,
            question=question,
            answer=result
        )

        return Response({
            'answer': result,
            'chat_id': chat.id
        })


class DocumentListAPIView(APIView):
    def get(self, request):
        documents = Document.objects.all().order_by('-uploaded_at')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
