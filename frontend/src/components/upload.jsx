import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setDocId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a PDF file.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('❌ Only PDF files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      setUploading(true);
      setMessage('');
      setDocId(null);

      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Upload successful!');
      setDocId(response.data.doc_id);
      navigate('/chat');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      setMessage('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="card-title text-center text-primary mb-4">Upload a PDF Document</h2>

        <div className="mb-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn btn-primary w-100"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>

        {message && (
          <div className={`alert mt-4 ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}

        {docId && (
          <div className="alert alert-info mt-3 text-center">
            <p className="mb-1">📄 <strong>Document uploaded successfully!</strong></p>
            <p className="mb-1">Document ID: <code>{docId}</code></p>
            <small className="text-muted">Use this ID while asking questions.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
