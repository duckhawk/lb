# Многоэтапная сборка для оптимизации размера образа
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev)
RUN npm ci

# Копируем исходные файлы (если есть TypeScript)
COPY . .

# Собираем проект (если нужно)
RUN npm run build || echo "No build script found, using existing JS files"

# Финальный образ
FROM node:20-alpine AS runtime

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем скомпилированные файлы из builder
COPY --from=builder /app/*.js ./
COPY --from=builder /app/*.js.map ./
COPY --from=builder /app/config/ ./config/

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Открываем порт
EXPOSE 8080

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=8080

# Health check для HTTP сервера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Команда запуска
CMD ["node", "server.js"]
