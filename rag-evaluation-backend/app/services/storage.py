# app/services/storage.py
import os
from typing import List, Optional


class FileStorage:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)
        print(f"[LOG] FileStorage инициализирован, директория: {upload_dir}")
    
    def save(self, filename: str, content: bytes) -> str:
        file_path = os.path.join(self.upload_dir, filename)
        with open(file_path, "wb") as f:
            f.write(content)
        print(f"[LOG] Файл сохранён: {filename}")
        return file_path
    
    def get_latest_file(self) -> Optional[str]:
        files = os.listdir(self.upload_dir)
        if not files:
            print("[LOG] Нет загруженных файлов")
            return None
        latest = max(files, key=lambda f: os.path.getctime(os.path.join(self.upload_dir, f)))
        print(f"[LOG] Последний файл: {latest}")
        return os.path.join(self.upload_dir, latest)
    
    def list_files(self) -> List[str]:
        files = os.listdir(self.upload_dir)
        print(f"[LOG] Список файлов: {files}")
        return files
    
    def delete(self, filename: str) -> bool:
        file_path = os.path.join(self.upload_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"[LOG] Файл удалён: {filename}")
            return True
        print(f"[LOG] Файл не найден: {filename}")
        return False