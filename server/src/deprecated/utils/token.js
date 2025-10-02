//token.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4, validate: uuidValidate, version: uuidVersion } = require('uuid');
const { JWT_SECRET_KEY } = require('../utils/secrets');
const { logger } = require('./logger');


const generateAccessToken = (user_id, deviceID) => jwt.sign({ user_id, deviceID }, JWT_SECRET_KEY, { expiresIn: '4d' });
const generateRefreshToken = (user_id, deviceID) => jwt.sign({ user_id, deviceID }, JWT_SECRET_KEY, { expiresIn: '7d' });
const generateDeviceID = () => {return uuidv4()};

const uuidValidateV4 = (uuid) => {return uuidValidate(uuid) && uuidVersion(uuid) === 4;};

const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    logger.error(`Ошибка при верификации токена: ${error.message}`);
    return null;
  }
};

const refreshAccessToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, JWT_SECRET_KEY);
  } catch (error) {
    logger.error(`Ошибка обновления токена доступа: ${error.message}`);
    return null;
  }
};

const userIdByToken = (token) => {
  try {
    console.log('token userIdByToken', token)
    const decoded = jwt.decode(token);
    const user_id = decoded.user_id;
    return user_id
  }
  catch (error) {
    console.log(error)
  }
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verify,
  refreshAccessToken,
  generateDeviceID,
  uuidValidateV4,
  userIdByToken,
};


