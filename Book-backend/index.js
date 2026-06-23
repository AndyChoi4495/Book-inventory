// Express 앱 부트스트랩: 미들웨어·CORS·라우트 마운트·DB 연결만 담당
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
const bookRoutes = require('./routes/bookRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 허용목록: 환경변수(CORS_ORIGINS, 콤마 구분) 우선, 없으면 기본값
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://book-inventory-frontend-plum.vercel.app',
    ];

app.use(
  cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(morgan('dev'));

// Test Route
app.get('/', (req, res) => {
  res.send('Book Inventory System API');
});

// Book routes
app.use('/api/books', bookRoutes);

// 404 + 중앙 에러 핸들러 (라우트 뒤에 등록)
app.use(notFound);
app.use(errorHandler);

// Connect to DB and Start Server (스키마는 sequelize-cli 마이그레이션으로 관리, sync 미사용)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connected...');
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = app;
