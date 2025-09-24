const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = 3001;
const HOST = '0.0.0.0'; // Что бы можно было принимать запросы с мобилки

app.listen(PORT, HOST, () => {
    logger.info(`Running on PORT ${PORT}`);
});
