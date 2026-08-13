# app/clients/rag_client.py
import httpx
from typing import List, Dict
from app.models import RAGResponse


class RAGAPIClient:
    def __init__(self, base_url: str, config_id: str, username: str, password: str):
        self.base_url = base_url
        self.config_id = config_id
        self.username = username
        self.password = password
        self._access_token = None
    
    async def _login(self) -> str:
        print("[LOG] Получение токена авторизации...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/login/",
                data={"username": self.username, "password": self.password},
                headers={
                    "Origin": "https://ai-assistant.is74.ru",
                    "Referer": "https://ai-assistant.is74.ru/login",
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            )
            response.raise_for_status()
            self._access_token = response.json().get("access_token")
            print("[LOG] Токен получен успешно")
            return self._access_token
    
    async def execute(self, question: str) -> RAGResponse:
        if not self._access_token:
            await self._login()
        
        print(f"[LOG] Отправка запроса к RAG API: {question[:50]}...")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/rags/rag_configs/{self.config_id}/execute",
                json={"phrases": [{"role": "user", "content": question}]},
                headers={"Authorization": f"Bearer {self._access_token}", "Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                print("[LOG] Токен устарел, обновляем...")
                await self._login()
                response = await client.post(
                    f"{self.base_url}/rags/rag_configs/{self.config_id}/execute",
                    json={"phrases": [{"role": "user", "content": question}]},
                    headers={"Authorization": f"Bearer {self._access_token}", "Content-Type": "application/json"}
                )
            
            response.raise_for_status()
            data = response.json()
            chunks_count = len(data.get("chunks", []))
            print(f"[LOG] Получено {chunks_count} чанков")
            return RAGResponse(data.get("request", question), data.get("chunks", []))