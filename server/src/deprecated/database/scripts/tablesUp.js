//tablesUp.js
const { logger } = require('../../utils/logger');
const { createTableUsers, createTableTokens, createTableResetPassword, createTableEmailConfirmed } = require('../queries'); // Добавлен импорт
const dbConfig = require('../../config/db.config');

(() => {
  dbConfig.query(createTableUsers, (err1, _) => {
    if (err1) {
      logger.error(err1.message);
      return;
    }
    logger.info('Table users created!');

    dbConfig.query(createTableTokens, (err2, _) => {
      if (err2) {
        logger.error(err2.message);
        return;
      }
      logger.info('Table tokens created!');

      dbConfig.query(createTableResetPassword, (err3, _) => {
        if (err3) {
          logger.error(err3.message);
          return;
        }
        logger.info('Table resetPassword created!');

        // Создание таблицы email_confirmed
        dbConfig.query(createTableEmailConfirmed, (err4, _) => {
          if (err4) {
            logger.error(err4.message);
            return;
          }
          logger.info('Table email_confirmed created!');
          process.exit(0);
        });
      });
    });
  });
})();

