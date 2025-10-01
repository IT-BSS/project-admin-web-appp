// errorHandler.js
exports.handleTokenExpiredError = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    return res.status(403).json({ message: 'Недействительный или истекший access токен' }); // Истекший токен, возвращаем статус 403 (Forbidden)
  }
  next(err);
};


exports.handleInvalidTokenError = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
    return res.sendStatus(403); // Недействительный токен, возвращаем статус 403 (Forbidden)
  }
  next(err);
};

exports.handleDatabaseError = (err, req, res, next) => {
  if (err.code === 'ER_PARSE_ERROR') {
    return res.sendStatus(500); // Ошибка базы данных, возвращаем статус 500 (Internal Server Error)
  }
  next(err);
};