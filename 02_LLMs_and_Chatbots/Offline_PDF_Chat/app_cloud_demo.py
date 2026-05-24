import streamlit as st
import os
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Using Ultra-Lightweight BM25 Search to guarantee 100% Cloud Uptime
from langchain_community.retrievers import BM25Retriever 

# Using Groq for Blazing Fast Free Cloud Inference
from langchain_groq import ChatGroq

# Using Modern LCEL Architecture
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
st.markdown("**Note:** This is the ultra-lightweight Cloud Demo version. For the highly secure, FAISS-powered offline version, clone the repo and run `app.py` locally.")

# Require the user to input a Groq API key
user_api_key = st.sidebar.text_input("Enter Groq API Key (Free at console.groq.com)", type="password")

st.sidebar.header("Data Ingestion")
uploaded_file = st.sidebar.file_uploader("Upload PDF Document", type="pdf")

@st.cache_resource
def process_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    data = loader.load()
    
    # Split text into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(data)
    
    # Use BM25 for pure-python, ML-free instant retrieval on Streamlit Cloud
    retriever = BM25Retriever.from_documents(docs)
    retriever.k = 3
    return retriever

if uploaded_file is not None:
    if not user_api_key:
        st.warning("Please enter a Groq API Key in the sidebar to continue.")
    else:
        temp_dir = tempfile.TemporaryDirectory()
        temp_filepath = os.path.join(temp_dir.name, uploaded_file.name)
        with open(temp_filepath, "wb") as f:
            f.write(uploaded_file.getvalue())

        st.sidebar.success("File uploaded and processed.")
        
        retriever = process_pdf(temp_filepath)
        st.sidebar.success("Search Engine Ready!")
        
        # Initialize Free Groq Model
        llm = ChatGroq(temperature=0, model_name="llama3-8b-8192", groq_api_key=user_api_key)
        
        # LCEL Architecture
        prompt_template = ChatPromptTemplate.from_template(
            "You are ZETA, an elite intelligence assistant. Answer based strictly on the context provided below.\n\nContext:\n{context}\n\nQuestion: {input}"
        )
        doc_chain = create_stuff_documents_chain(llm, prompt_template)
        qa_chain = create_retrieval_chain(retriever, doc_chain)
        
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
