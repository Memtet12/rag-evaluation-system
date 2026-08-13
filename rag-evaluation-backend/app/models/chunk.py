import re
from typing import List, Dict
from app.utils.normalizations import normalize_document_name


class Chunk:
    """Модель чанка (фрагмента документа)"""
    
    def __init__(self, path: str, document_id: int, content: List[Dict]):
        self.path = path
        self.document_id = document_id
        self.content = content
    
    @property
    def document_name(self) -> str:
        """Извлекает имя документа из пути"""
        if not self.path:
            return ""
        name = self.path.split('/')[-1]
        name = re.sub(r'\.md$', '', name)
        return normalize_document_name(name)