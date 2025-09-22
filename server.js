const express = require('express');
const { botFunction } = require('./main');

const app = express();
const port = process.env.PORT || 8080;

// Middleware для парсинга JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Основной endpoint для Telegram webhook
app.post('/', async (req, res) => {
  try {
    await botFunction(req, res);
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработка всех остальных запросов
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Запуск сервера
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
