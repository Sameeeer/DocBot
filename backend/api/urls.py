from django.urls import path
from .views import DocumentUpload, AskQuestion, DocumentListAPIView

urlpatterns = [
    path('upload/', DocumentUpload.as_view(), name='upload'),
    path('ask/', AskQuestion.as_view(), name='ask'),
    path('documents/', DocumentListAPIView.as_view(), name='documents'),
]
