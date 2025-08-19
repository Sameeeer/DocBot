import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    axios.get('/documents/')
      .then(res => {
        setDocuments(res.data);
        if (res.data.length > 0) {
          setSelectedDocId(res.data[0].id);
        } else {
          navigate('/upload');
        }
      })
      .catch(() => navigate('/upload'));
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!question || !selectedDocId) {
      alert("Please enter a question and select a document.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/ask/', {
        question,
        doc_id: selectedDocId,
      });

      setMessages(prev => [
        ...prev,
        { type: 'user', text: question },
        { type: 'bot', text: response.data.answer },
      ]);
      setQuestion('');
    } catch (error) {
      alert("Something went wrong while asking your question.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '700px', border: '2px solid lightblue', borderRadius: '1rem' }}>
        <h4 className="mb-3 text-center" style={{ color: 'lightblue' }}>AI Document Chat</h4>

        <select
          value={selectedDocId}
          onChange={(e) => setSelectedDocId(e.target.value)}
          className="form-select mb-3 border border-danger-subtle"
        >
          <option value="">Select a document</option>
          {documents.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.title}
            </option>
          ))}
        </select>

        <div className="chat-box bg-light p-3 mb-3 rounded overflow-auto" style={{ height: '400px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded ${msg.type === 'user' ? 'bg-warning-subtle text-end ms-auto' : 'bg-secondary-subtle text-start me-auto'}`}
              style={{ maxWidth: '75%' }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="text-muted fst-italic">Thinking...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="d-flex">
          <textarea
            rows="1"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-control me-2"
            placeholder="Ask a question..."
            style={{ resize: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !selectedDocId}
            className="btn text-white"
            style={{
              backgroundColor: loading || !selectedDocId ? '#ccc' : '#6ad1fdff',
              cursor: loading || !selectedDocId ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
