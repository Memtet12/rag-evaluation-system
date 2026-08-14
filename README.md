# RAG Evaluation System

Система для оценки качества RAG (Retrieval‑Augmented Generation) с метриками **Precision@k**, **Recall@k**, **Hit Rate@k**, **MRR**.

---

## Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Memtet12/rag-evaluation-system.git
cd rag-evaluation-system
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
# Заполни .env своими данными (логин, пароль)
```

### 3. Установить зависимости

#### Бэкенд

```bash
cd rag-evaluation-backend
python -m venv venv
source venv/bin/activate  # Для Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Фронтенд

```bash
cd ../rag-ui
npm install
```

### 4. Запустить

#### Бэкенд (в одном терминале)

```bash
cd rag-evaluation-backend
python run.py
```

#### Фронтенд (в другом терминале)

```bash
cd rag-ui
npm start
```

### 5. Использовать

1. Открой `http://localhost:3000`.
2. Загрузи JSON‑датасет.
3. Выбери метрики и нажми **«Запустить оценку»**.
4. Посмотри результаты.

### 6. Документация API

После запуска бэкенда доступна по адресу:  
`http://localhost:8000/docs`

---

## Технологии

| Компонент | Технологии        |
| --------- | ----------------- |
| Бэкенд    | Python, FastAPI   |
| Фронтенд  | React, TypeScript |
