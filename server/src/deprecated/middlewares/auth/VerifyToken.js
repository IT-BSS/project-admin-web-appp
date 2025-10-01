//verifyToken.js
const { verify } = require('../../utils/token');
const { decryptData } = require('../../utils/crypt')
const { ENCRYPTION_SECRET_KEY } = require('../../utils/secrets')

exports.verifyToken = (req, res, next) => {
  const encryptedAccessToken = req.cookies.accessToken;

  const encryptionKey = Buffer.from(ENCRYPTION_SECRET_KEY, 'hex'); // Создание байтового массива из шестнадцатеричной строки
  // console.log('encryptionKey', encryptionKey)


  const decryptedAccessToken = decryptData(encryptedAccessToken, encryptionKey);
  // console.log('decryptedAccessToken', decryptedAccessToken)

  const decoded = verify(decryptedAccessToken);
  // console.log("decoded1212 decryptedAccessToken", decoded);

  if (!decoded) {
    // Если токен недействителен, вызываем функцию next с объектом ошибки, содержащим access токен
    return next({ name: 'TokenExpiredError', decryptedAccessToken });
  }

  const token = decryptedAccessToken
  req.user = token;
  next();
};