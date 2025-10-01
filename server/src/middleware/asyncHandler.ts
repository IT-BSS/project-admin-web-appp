import type { Request, Response, NextFunction } from "express";

const asyncHandler = (cb: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cb(req, res, next); // Выполнение асинхронного обработчика с использованием await
    } catch (err: any) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        }); // Отправка ошибки клиенту, если что-то пошло не так
    }
    return true; // Возвращается true, чтобы завершить middleware и перейти к следующему обработчику
}

export { asyncHandler }