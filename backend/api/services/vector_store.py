import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

CHROMA_DB_PATH = "chroma_store"

def process_pdf(file_path, doc_id):
    # Read PDF
    pdf = fitz.open(file_path)
    text = ""
    for page in pdf:
        text += page.get_text()

    # Split text into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    # Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Store in Chroma
    vectordb = Chroma(
        collection_name=str(doc_id),
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_PATH
    )
    vectordb.add_texts(chunks)
    vectordb.persist()
    return len(chunks)

def get_relevant_chunks(query, doc_id):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectordb = Chroma(
        collection_name=str(doc_id),
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_PATH
    )
    results = vectordb.similarity_search(query, k=3)
    return "\n".join([r.page_content for r in results])
