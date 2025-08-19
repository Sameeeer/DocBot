from rest_framework import serializers
from .models import Document, ChatHistory


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'uploaded_at', 'text_content']
        read_only_fields = ['id', 'uploaded_at', 'text_content']


class ChatHistorySerializer(serializers.ModelSerializer):
    document_id = serializers.IntegerField(source='document.id', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)

    class Meta:
        model = ChatHistory
        fields = ['id', 'document_id', 'document_title', 'question', 'answer', 'created_at']
        read_only_fields = ['id', 'created_at', 'document_id', 'document_title']
