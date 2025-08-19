from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/') 
    uploaded_at = models.DateTimeField(auto_now_add=True)
    text_content = models.TextField(blank=True)  # stores extracted PDF text

    def __str__(self):
        return self.title or f"Document {self.id}"



class ChatHistory(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chats')
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Q: {self.question[:50]}"  
