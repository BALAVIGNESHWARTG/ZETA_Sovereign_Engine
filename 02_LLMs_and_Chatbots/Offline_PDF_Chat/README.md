# 🛡️ Z.E.T.A. Offline PDF Intelligence (RAG Engine)

## 📌 Project Focus
This is a **Sovereign-Tier, 100% Offline RAG (Retrieval-Augmented Generation) Chatbot**. 
It allows users to upload highly confidential PDF documents (legal contracts, financial statements, proprietary IP) and instantly query them using AI, without a single byte of data ever leaving the physical machine or being sent to external cloud APIs like OpenAI.

## 🚀 Rapid MVP Showcasing
When pitching this to investors, enterprise clients, or displaying it on your GitHub Portfolio, highlight the **Data Privacy** angle. 

**Real-Time Usecases:**
1. **Law Firms:** Upload 500-page discovery documents and ask "What clause in section 4 contradicts the witness statement?" without violating client-attorney privilege.
2. **Hospitals:** Upload patient records to extract trends without violating HIPAA compliance.
3. **Internal VC Diligence:** Analyze startup pitch decks privately before making investment decisions.

## 👁️ Live Demo vs. Sovereign Architecture
To ensure absolute data privacy, the core of this repository (`app.py`) is designed as a **Sovereign Architecture**. It runs strictly offline using a local Llama 3 model. 

However, to allow recruiters and GitHub visitors to test the UI/UX instantly, I have deployed a **Cloud Demo Version** using the blazing-fast Groq LPU API. 

👉 **[Try the Live Cloud Demo Here](https://your-streamlit-app-url.streamlit.app/)** 

*(Note: The live demo is a functional replica, but for true offline security, clone this repo and run the Sovereign `app.py` locally).*

## 🛠️ The Tech Stack (ZETA Powerhouse)
* **Frontend:** `Streamlit` (Provides the sleek, dark-mode chat UI)
* **Brain:** `Ollama` running `llama3` (Executes the logic offline)
* **Memory:** `FAISS` Vector Database (Converts text into mathematical vectors)
* **Orchestration:** `LangChain` (Routes the PDF text into the Vector DB, and pulls it out for the LLM)

---

## ⚡ How to Run It Right Now

1. **Ensure Ollama is running:**
   Open a terminal and type `ollama run llama3` to ensure the model is downloaded and active in the background.

2. **Boot the ZETA UI:**
   From this project folder (`E:\All Projects\02_LLMs_and_Chatbots\Offline_PDF_Chat`), run the following command in PowerShell to boot the web application:
   ```powershell
   .venv\Scripts\streamlit run app.py
   ```

3. **Deploy:**
   The UI will open instantly in your browser at `http://localhost:8501`. Upload a PDF, wait for the FAISS database to compile, and start hacking!

---
*Architected under the Z.E.T.A. Enterprise Ascension Protocols.*
