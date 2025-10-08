import express, { type ErrorRequestHandler, type NextFunction } from 'express';
import type { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { adminUserRouter } from './routes/admin/user/adminUserRoute';
import { organizationRoute } from './routes/admin/organization/organizationRoute'
import { roleRoute } from './routes/admin/role/roleRoute';

//import { httpLogStream } from './deprecated/utils/logger';

const app: Express = express();

/*import { adminUserRouter } from "./routes/admin/user/adminUserRoute"
const userRoute = require('./routes/auth/user.route')
*/

app.options('*', cors()); // отвечаем на preflight для всяких PUT/DELETE
// Позволяет запросам с использованием куков отправлять куки обратно на сервер
app.use(cors({ 
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true, // Разрешаем отправку куки на клиенте
}));

app.use(cookieParser());

app.use(morgan('dev'));
//app.use(morgan('combined', { stream: httpLogStream }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", adminUserRouter);
app.use("/api", organizationRoute);
app.use("/api", roleRoute);
/*
app.use('/api', reviews, GetProductFilters)
app.use('/api', product, catalogRoutes, productsAbout) // Вот тут роут для получение карточек а так же для - каталога и фильтра, а так же пагинации и т.п
app.use('/api/auth', authRoute, userRoute);
app.use('/api/auth/refresh', refreshRoute); // Используем маршрут для обновления токена

*/
// app.use('/api/order/', payment, order);

/* deprecated

// Подключаем errorHandler

import errorHandler from './deprecated/middlewares/auth/errorHandler';

// Используем errorHandler для обработки ошибок
app.use(errorHandler.handleTokenExpiredError);
app.use(errorHandler.handleInvalidTokenError);
app.use(errorHandler.handleDatabaseError);
*/

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
}

app.use(errorHandler);

export default app;
