# Развертывание в Google Cloud Serverless

## Варианты развертывания

### 1. Google Cloud Run (Рекомендуется)

```bash
# Сборка и развертывание с правильными настройками логирования
gcloud builds submit --config cloudbuild.yaml --tag gcr.io/PROJECT_ID/larp-bugle-bot

# Или простая сборка без service account
gcloud builds submit --tag gcr.io/PROJECT_ID/larp-bugle-bot

# Развертывание в Cloud Run
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

## Решение проблем со сборкой

### Ошибка с service_account и логированием

Если получаете ошибку:
```
Failed to trigger build: if 'build.service_account' is specified, the build must either (a) specify 'build.logs_bucket', (b) use the REGIONAL_USER_OWNED_BUCKET build.options.default_logs_bucket_behavior option, or (c) use either CLOUD_LOGGING_ONLY / NONE logging options
```

**Решение 1: Используйте cloudbuild.yaml**
```bash
gcloud builds submit --config cloudbuild.yaml
```

**Решение 2: Простая сборка без service account**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/larp-bugle-bot
```

**Решение 3: Укажите опции логирования**
```bash
gcloud builds submit \
  --tag gcr.io/PROJECT_ID/larp-bugle-bot \
  --logging=CLOUD_LOGGING_ONLY
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
