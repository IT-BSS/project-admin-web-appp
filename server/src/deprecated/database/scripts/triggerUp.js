//triggerUp.js
const { logger } = require('../../utils/logger');
const { createTriggerAfterPasswordChange } = require('../queries'); // Подключите ваш запрос для создания триггера
const dbConfig = require('../../../config/db.config');

(() => {
  dbConfig.query(createTriggerAfterPasswordChange, (err, _) => {
    if (err) {
      logger.error(err.message);
      return;
    }
    logger.info('Trigger created!');
    process.exit(0);
  });
})();
