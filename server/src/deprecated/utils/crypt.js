//crypt.js
const crypto = require('crypto');
const { logger } = require('./logger');

// Размер IV в байтах (в данном случае 16 байт)
const ivSize = 16;

const encryptData = (data, encryptionKey) => {
  try {
    const iv = crypto.randomBytes(ivSize);
    const cipher = crypto.createCipheriv('chacha20', encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = iv.toString('hex') + encrypted;
    return encryptedData;
  } catch (error) {
    logger.error(`Ошибка при шифровании данных: ${error.message}`);
    return null;
  }
};

const decryptData = (encryptedData, encryptionKey) => {
  try {
    const iv = encryptedData.substring(0, ivSize * 2); // Получение первых 16 символов (16 байт)
    const encryptedText = encryptedData.substring(ivSize * 2); // Остальная часть

    const decipher = crypto.createDecipheriv('chacha20', encryptionKey, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  } catch (error) {
    logger.error(`Ошибка при дешифровании данных: ${error.message}`);
    return null;
  }
};

module.exports = {
  encryptData,
  decryptData
};