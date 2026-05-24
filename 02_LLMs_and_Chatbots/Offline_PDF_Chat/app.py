import streamlit as st
import os
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain_classic.chains import RetrievalQA

st.set_page_config(page_title="ZETA Offline PDF Intel", page_icon="🛡️", layout="wide")

st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    .css-1d391kg {
        background-color: #1E1E1E;
    }
</style>
""", unsafe_allow_html=True)

st.title("🛡️ Z.E.T.A. Sovereign Engine: Offline PDF Intelligence")
st.markdown("**100% Local. Zero Cloud APIs. Absolute Data Privacy.**")

st.sidebar.header("Data Ingestion (FAISS Vector Memory)")
uploaded_file = st.sidebar.file_uploader("Upload Confidential PDF", type="pdf")

# Define the local model you want to use here (Ensure you ran `ollama run llama3` in cmd)
LOCAL_MODEL = "llama3" 

@st.cache_resource
def process_pdf(pdf_path):
    with st.spinner("Parsing Document..."):
        loader = PyPDFLoader(pdf_path)
        data = loader.load()
        
    with st.spinner("Chunking Memory..."):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(data)
        
    with st.spinner(f"Generating Vector Embeddings (via local {LOCAL_MODEL})..."):
        # We use Ollama for embeddings so nothing leaves the machine
        embeddings = OllamaEmbeddings(model=LOCAL_MODEL)
        vectorstore = FAISS.from_documents(docs, embeddings)
        
    return vectorstore

if uploaded_file is not None:
    # Save uploaded file temporarily to disk so PyPDFLoader can read it
    temp_dir = tempfile.TemporaryDirectory()
    temp_filepath = os.path.join(temp_dir.name, uploaded_file.name)
    with open(temp_filepath, "wb") as f:
        f.write(uploaded_file.getvalue())

    st.sidebar.success("File uploaded securely to local disk.")
    
    # Process PDF and build local Vector Database
    vectorstore = process_pdf(temp_filepath)
    st.sidebar.success("Vector Database (FAISS) Built!")
    
    # Initialize Local LLM
    llm = Ollama(model=LOCAL_MODEL)
    
    # Create the RAG Chain
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
    )
    
    st.markdown("### Secure Chat Interface")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Query the document securely..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("ZETA Engine thinking..."):
                response = qa_chain.invoke({"query": prompt})
                result = response["result"]
                st.markdown(result)
        st.session_state.messages.append({"role": "assistant", "content": result})

else:
    st.info("Awaiting secure document ingestion. Please upload a PDF in the sidebar to initialize the RAG vector engine.")
