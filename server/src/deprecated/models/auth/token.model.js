// token.model.js
const db = require('../../config/db.config');
const { createNewToken: createNewTokenQuery, findDataByAccessToken: findDataByAccessTokenQuery, findUserById: findUserByIdQuery, updateToken: updateTokenQuery } = require('../../database/queries');
const { logger } = require('../../utils/logger');
const { refreshAccessToken, generateAccessToken } = require('../../utils/token');

class Token {
  constructor(accessToken, data) {
    this.accessToken = accessToken;
    this.data = data;
  }



  static create(token, cb) {
    db.query(createNewTokenQuery,
      [token.user_id, token.deviceID, token.accessToken, token.refreshToken], // Add the refresh token here
      (err, res) => { // Добавляем user_id, access_token, и refresh_token
        console.log('res', res)
        console.log('err', err)
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, {
          user_id: res.insertId,
          deviceID: token.deviceID,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken, // Add the refresh token here
          data: token.data
        });
      });
  }

  static getActiveSessions(cb) {
    const query = "SELECT user_id, device_id, created_on FROM tokens";
    
    db.query(query, (err, results) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      cb(null, results);
    });
  }

  static updateToken(deviceID, accessToken, refreshToken, cb) {
    db.query(updateTokenQuery, [accessToken, refreshToken, deviceID], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, {
        deviceID: deviceID,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    });
  }

  static deleteTokenByDeviceID(deviceID, cb) {
    const query = "DELETE FROM tokens WHERE device_id = ?";
  
    db.query(query, [deviceID], (err, result) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
  
      cb(null, result);
    });
  }

  static refreshToken(refreshToken, cb) {
    console.log('refresh token dec', refreshToken)
    const decoded = refreshAccessToken(refreshToken);
    console.log('decoded.', decoded)
    if (!decoded) {
      cb({ kind: "invalid_refresh_token" }, null);
      return;
    }

    const newAccessToken = generateAccessToken(decoded.user_id);
    db.query(updateToken, [newAccessToken, refreshToken, decoded.user_id], // Сохраняем новый токен доступа и оригинальный токен обновления
      (err, res) => {
        console.log('decoded.user_id, newAccessToken, refreshToken',
          decoded.user_id,
          newAccessToken,
          refreshToken
        )
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        cb(null, {
          user_id: res.insertId,
          accessToken: newAccessToken,
          refreshToken: refreshToken,
          data: decoded
        });
      }
    );
  }

  static findRefreshTokenByDeviceID(deviceID, cb) {
    const query = "SELECT refresh_token FROM tokens WHERE device_id = ?";

    db.query(query, [deviceID], (err, results) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      if (results.length === 0) {
        cb(null, null);
        return;
      }

      cb(null, results[0].refresh_token);
    });
  }

  static findRefreshTokenByUserId(userId, cb) {
    const query = "SELECT refresh_token FROM tokens WHERE user_id = ?";

    db.query(query, [userId], (err, results) => {
      console.error('err', err)
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      if (results.length === 0) {
        cb(null, null);
        return;
      }

      cb(null, results[0].refresh_token);
    });
  }

  static findUserById(user_id, cb) {
    db.query(findUserByIdQuery, [user_id], (err, results) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      if (results.length === 0) {
        cb(null, null);
        return;
      }

      cb(null, results[0]);
    });
  }

  static getUserDataByToken(accessToken, cb) {
    console.log('accessToken getUserDataByToken', accessToken)
    console.log('cb', cb)
    db.query(findDataByAccessTokenQuery, accessToken, (err, tokenRes) => {
      console.log('tokenRes', tokenRes)
      console.log('err', err)
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }

      if (tokenRes.length === 0) {
        cb({ kind: "tokenRes not_found" }, null);
        return;
      }

      const userId = tokenRes[0].user_id;
      // console.log('tokenRes', tokenRes[0])
      // console.log("userId", userId)

      db.query(findUserByIdQuery, userId, (err, userRes) => {
        console.log('userRes', userRes)
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }

        if (userRes.length === 0) {
          cb({ kind: "not_found" }, null);
          return;
        }

        cb(null, userRes[0]);
      });
    });
  }


}

module.exports = Token;