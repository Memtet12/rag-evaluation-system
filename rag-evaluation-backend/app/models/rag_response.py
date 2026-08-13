from typing import List, Dict
from .chunk import Chunk


class RAGResponse:
    """Модель ответа от RAG API"""
    
    def __init__(self, request_text: str, chunks_data: List[Dict]):
        self.request_text = request_text
        self.chunks = [Chunk(c.get("path", ""), c.get("document_id", 0), c.get("content", [])) for c in chunks_data]
    
    def get_retrieved_documents(self) -> List[str]:
        """Возвращает список имён найденных документов"""
        return [chunk.document_name for chunk in self.chunks if chunk.document_name]