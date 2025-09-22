# Развертывание в Google Cloud Serverless

## Варианты развертывания

### 1. Google Cloud Run (Рекомендуется)

```bash
# Сборка и развертывание
gcloud builds submit --tag gcr.io/PROJECT_ID/larp-bugle-bot
gcloud run deploy larp-bugle-bot \
  --image gcr.io/PROJECT_ID/larp-bugle-bot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="TELEGRAM_BOT_TOKEN=your_token,GOOGLE_CLOUD_PROJECT=your_project"
```

### 2. Google App Engine

```bash
# Развертывание с app.yaml
gcloud app deploy
```

### 3. Google Cloud Functions

```bash
# Развертывание как Cloud Function
gcloud functions deploy larp-bugle-bot \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --source . \
  --entry-point botFunction
```

## Переменные окружения

Убедитесь, что установлены следующие переменные:

- `TELEGRAM_BOT_TOKEN` - токен Telegram бота
- `WEBHOOK_URL` - URL для webhook (для Cloud Run/App Engine)
- `GOOGLE_CLOUD_PROJECT` - ID проекта Google Cloud

## Локальная разработка

```bash
# Сборка образа
docker build -t larp-bugle-bot .

# Запуск локально
docker run -p 8080:8080 \
  -e TELEGRAM_BOT_TOKEN=your_token \
  -e GOOGLE_CLOUD_PROJECT=your_project \
  larp-bugle-bot
```

## Мониторинг

После развертывания используйте Google Cloud Console для мониторинга:
- Cloud Run: Cloud Run > Services
- App Engine: App Engine > Versions
- Cloud Functions: Cloud Functions > Functions
