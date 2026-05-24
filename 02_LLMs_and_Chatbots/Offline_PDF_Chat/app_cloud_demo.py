import streamlit as st
import os
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
# Using HuggingFace for Free Cloud Embeddings instead of Local Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings 
# Using Groq for Blazing Fast Free Cloud Inference
from langchain_groq import ChatGroq
# Using Modern LCEL Architecture to avoid Cloud Dependency Conflicts
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

st.set_page_config(page_title="ZETA PDF Intel (Cloud Demo)", page_icon="☁️", layout="wide")

st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
</style>
""", unsafe_allow_html=True)

st.title("☁️ Z.E.T.A. Cloud Demo: PDF Intelligence")
st.markdown("**Note:** This is the Cloud Demo version using Groq. For the strictly secure offline version, run `app.py` locally.")

# Require the user (or recruiter) to input a Groq API key, so you are NEVER charged money!
# Groq API keys are 100% free at console.groq.com
user_api_key = st.sidebar.text_input("Enter Groq API Key (Free at console.groq.com)", type="password")

st.sidebar.header("Data Ingestion")
uploaded_file = st.sidebar.file_uploader("Upload PDF Document", type="pdf")

@st.cache_resource
def process_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    data = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(data)
    
    # HuggingFace is 100% free for embeddings on the cloud
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embeddings)
    return vectorstore

if uploaded_file is not None:
    if not user_api_key:
        st.warning("Please enter a Groq API Key in the sidebar to continue.")
    else:
        temp_dir = tempfile.TemporaryDirectory()
        temp_filepath = os.path.join(temp_dir.name, uploaded_file.name)
        with open(temp_filepath, "wb") as f:
            f.write(uploaded_file.getvalue())

        st.sidebar.success("File uploaded to ephemeral cloud storage.")
        
        vectorstore = process_pdf(temp_filepath)
        st.sidebar.success("Vector Database Built!")
        
        # Initialize Free Groq Model
        llm = ChatGroq(temperature=0, model_name="llama3-8b-8192", groq_api_key=user_api_key)
        
        # Modern LCEL Chain Architecture
        prompt_template = ChatPromptTemplate.from_template("Answer based strictly on the context provided below.\n\nContext:\n{context}\n\nQuestion: {input}")
        doc_chain = create_stuff_documents_chain(llm, prompt_template)
        qa_chain = create_retrieval_chain(vectorstore.as_retriever(search_kwargs={"k": 3}), doc_chain)
        
        st.markdown("### Cloud Chat Interface")
        
        if "messages" not in st.session_state:
            st.session_state.messages = []

        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        if prompt := st.chat_input("Query the document..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            with st.chat_message("assistant"):
                with st.spinner("Groq LPU thinking..."):
                    response = qa_chain.invoke({"input": prompt})
                    result = response["answer"]
                    st.markdown(result)
            st.session_state.messages.append({"role": "assistant", "content": result})
else:
    st.info("Please upload a PDF to begin.")
