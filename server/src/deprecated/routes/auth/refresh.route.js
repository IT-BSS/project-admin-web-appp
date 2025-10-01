//refresh.route.js
const router = require('express').Router();
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { refreshAccessToken } = require('../../controllers/auth/refresh.controller');

router.route('/')
  .post(asyncHandler(refreshAccessToken)); // Обработчик обновления токена будет принимать POST-запрос на маршрут '/'

module.exports = router;
