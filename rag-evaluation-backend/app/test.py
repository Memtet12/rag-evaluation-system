# test_env.py
import os
from dotenv import load_dotenv

load_dotenv()

print("RAG_API_URL:", os.getenv("RAG_API_URL"))
print("RAG_CONFIG_ID:", os.getenv("RAG_CONFIG_ID"))
print("RAG_USERNAME:", os.getenv("RAG_USERNAME"))
print("RAG_PASSWORD:", os.getenv("RAG_PASSWORD"))