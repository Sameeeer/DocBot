📄 DocBot

DocBot is an AI-powered document chatbot that allows users to upload PDF files and interact with them conversationally.
It combines Django REST Framework (backend), ReactJS (frontend), and LLMs (via Ollama) with ChromaDB for vector search.

🚀 Features

🔹 Document Upload – Upload PDFs and process them for Q&A.

🔹 AI Chatbot – Ask natural language questions about your documents.

🔹 Ollama + Mistral Model – Lightweight and fast LLMs for efficient inference.

🔹 LangChain Integration – Handles embeddings, vector storage, and retrieval.

🔹 ChromaDB – Stores embeddings for semantic document search.

🔹 React Chat UI – Simple and interactive chatbox for user queries.

🏗️ Tech Stack
Backend (Django REST Framework)

Python, Django REST Framework

LangChain (for document embeddings and retrieval)

ChromaDB (vector database for storing document chunks)

Ollama (LLM runtime for Mistral model)

Frontend (ReactJS)

React + Axios for API calls

Chatbox UI for user interaction

AI / NLP

Mistral (served locally via Ollama) for fast and lightweight Q&A

Embeddings (HuggingFace / SentenceTransformers) for semantic search

⚙️ Installation
1️⃣ Backend Setup
# Clone repo
git clone https://github.com/your-username/docbot.git
cd docbot/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver

2️⃣ Start Ollama (Mistral model)

Make sure Ollama
 is installed. Then pull and run Mistral:

ollama pull mistral
ollama run mistral

3️⃣ Frontend Setup
cd ../frontend

# Install dependencies
npm install

# Start frontend
npm start