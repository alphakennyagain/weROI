FROM python:3.12-slim

WORKDIR /app

COPY requirements-prod.txt .
RUN pip install --no-cache-dir -r requirements-prod.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

# Railway injects PORT at runtime; use shell form so ${PORT} expands correctly.
CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
