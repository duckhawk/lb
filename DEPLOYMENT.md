# Развертывание в Google Cloud Serverless

## Варианты развертывания

### 1. Google Cloud Run (Рекомендуется)

**Сначала создайте Artifact Registry репозиторий:**
```bash
# Создание репозитория в Artifact Registry
gcloud artifacts repositories create larp-bugle-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for larp-bugle-bot"
```

**Сборка и развертывание:**

**Вариант 1: Artifact Registry (рекомендуется)**
```bash
# Сборка с автоматическим созданием репозитория
gcloud builds submit --config cloudbuild.yaml

# Развертывание в Cloud Run
gcloud run deploy larp-bugle-bot \
  --image us-central1-docker.pkg.dev/PROJECT_ID/larp-bugle-repo/larp-bugle-bot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="TELEGRAM_BOT_TOKEN=your_token,GOOGLE_CLOUD_PROJECT=your_project"
```

**Вариант 2: Container Registry (если Artifact Registry недоступен)**
```bash
# Сборка с Container Registry
gcloud builds submit --config cloudbuild-gcr.yaml

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

## Миграция с Container Registry на Artifact Registry

### Автоматическая миграция
```bash
# Автоматическая миграция из GCR в Artifact Registry
gcloud artifacts docker upgrade migrate --projects=PROJECT_ID
```

### Ручная настройка Artifact Registry
```bash
# 1. Создание репозитория
gcloud artifacts repositories create larp-bugle-repo \
  --repository-format=docker \
  --location=us-central1

# 2. Настройка аутентификации
gcloud auth configure-docker us-central1-docker.pkg.dev

# 3. Сборка и отправка образа
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/larp-bugle-repo/larp-bugle-bot .
docker push us-central1-docker.pkg.dev/PROJECT_ID/larp-bugle-repo/larp-bugle-bot
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

### Ошибка с Container Registry (GCR deprecated)

Если получаете ошибку:
```
Container Registry is deprecated and shutting down, please use the auto migration tool
```

**Решение: Переход на Artifact Registry**
```bash
# 1. Создайте репозиторий в Artifact Registry
gcloud artifacts repositories create larp-bugle-repo \
  --repository-format=docker \
  --location=us-central1

# 2. Используйте новый URL для сборки
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/larp-bugle-repo/larp-bugle-bot
```

### Ошибка 404 при сборке в Artifact Registry

Если получаете ошибку:
```
error parsing HTTP 404 response body: invalid character '<' looking for beginning of value
```

**Решение: Используйте Container Registry как fallback**
```bash
# Используйте cloudbuild-gcr.yaml для сборки в Container Registry
gcloud builds submit --config cloudbuild-gcr.yaml

# Или создайте репозиторий вручную перед сборкой
gcloud artifacts repositories create larp-bugle-repo \
  --repository-format=docker \
  --location=us-central1
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
