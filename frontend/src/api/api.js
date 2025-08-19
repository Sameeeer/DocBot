import axios from 'axios';

// Update this for deployment
const BASE_URL = 'http://localhost:8000';

// Upload PDF to the backend
export const uploadPDF = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Contains uploaded doc info
  } catch (error) {
    console.error('PDF Upload Error:', error);
    throw error;
  }
};

// Send question + document ID to the backend
export const sendQuery = async (question, documentId) => {
  try {
    const response = await axios.post(`${BASE_URL}/ask/`, {
      question,
      document_id: documentId,
    });
    return response.data; // Should return chatbot answer
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  }
};
