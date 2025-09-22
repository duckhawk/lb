#!/bin/bash

# Скрипт для миграции с Container Registry на Artifact Registry
# Использование: ./migrate-to-artifact-registry.sh PROJECT_ID REGION

set -e

PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
REPO_NAME="larp-bugle-repo"
IMAGE_NAME="larp-bugle-bot"

echo "🚀 Миграция на Artifact Registry для проекта: $PROJECT_ID"
echo "📍 Регион: $REGION"

# Проверяем, что проект установлен
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Ошибка: Не указан PROJECT_ID"
    echo "Использование: $0 PROJECT_ID [REGION]"
    exit 1
fi

echo "📦 Создание репозитория в Artifact Registry..."
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="Docker repository for larp-bugle-bot" \
  --quiet || echo "⚠️  Репозиторий уже существует"

echo "🔐 Настройка аутентификации Docker..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

echo "🏗️  Сборка Docker образа..."
docker build -t ${REGION}-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME .

echo "📤 Отправка образа в Artifact Registry..."
docker push ${REGION}-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME

echo "🚀 Развертывание в Cloud Run..."
gcloud run deploy larp-bugle-bot \
  --image ${REGION}-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN},GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

echo "✅ Миграция завершена!"
echo "🌐 URL сервиса: https://larp-bugle-bot-$(echo $PROJECT_ID | cut -c1-8)-uc.a.run.app"
