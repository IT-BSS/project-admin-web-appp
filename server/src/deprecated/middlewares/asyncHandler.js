//asyncHandler.js
const asyncHandler = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next); // Выполнение асинхронного обработчика с использованием await
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        }); // Отправка ошибки клиенту, если что-то пошло не так
    }
    return true; // Возвращается true, чтобы завершить middleware и перейти к следующему обработчику
}

module.exports = {
    asyncHandler
}
