FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python -c "from huggingface_hub import snapshot_download; import os; snapshot_download(repo_id='danielfahko/snbpredict-model', repo_type='model', local_dir='model_artifacts'); [print(os.path.join(r,f)) for r,d,files in os.walk('model_artifacts') for f in files]"

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
