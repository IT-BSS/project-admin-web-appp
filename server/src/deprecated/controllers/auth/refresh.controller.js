// refresh.controller.js
const { generateAccessToken, verify, uuidValidateV4 } = require('../../utils/token');
const { encryptData, decryptData } = require('../../utils/crypt')
const jwt = require('jsonwebtoken')
const { hash, compare } = require('../../utils/password');
const Token = require('../../models/auth/token.model');
const { ENCRYPTION_SECRET_KEY } = require('../../utils/secrets')

exports.refreshAccessToken = async (req, res, next) => {
  const encryptedRefreshToken = req.cookies.refreshToken;

  console.log('encryptedrefreshToken', encryptedRefreshToken)
  const encryptionKey = Buffer.from(ENCRYPTION_SECRET_KEY, 'hex'); // Создание байтового массива из шестнадцатеричной строки
  console.log('encryptionKey', encryptionKey)

  const decryptedRefreshToken = decryptData(encryptedRefreshToken, encryptionKey);
  console.log('decryptedRefreshToken', decryptedRefreshToken)



  if (!decryptedRefreshToken) {
    return res.status(400).json({ message: 'Отсутствует refresh токен' });
  }

  try {
    const decoded = verify(decryptedRefreshToken);
    console.log('decoded', decoded)
    if (!decoded) {
      const decodedToken = jwt.decode(decryptedRefreshToken);
      console.log(decodedToken)
      const { deviceID } = decodedToken;
      console.log(deviceID)
      // Удалить запись из базы данных по deviceID
      Token.deleteTokenByDeviceID(deviceID, (deleteErr, deletedToken) => {
        if (deleteErr) {
          console.error('Ошибка при удалении токена из базы данных:', deleteErr);
          return res.status(500).json({ message: 'Ошибка при удалении токена' });
        }
      })
      
      // Удаляем все cookie
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      return res.status(403).json({ message: 'Недействительный refresh токен' });
    }

    console.log('decoded refresh', decoded)

    const { deviceID, user_id } = decoded;

    if (!uuidValidateV4(deviceID)) {
      return res.status(400).json({ message: 'Недействительный UUID устройства' });
    }

    // Ищем пользователя с данным user_id в базе данных
    Token.findUserById(user_id, (err, user) => {
      if (err || !user) {
        return res.status(403).json({ message: 'Пользователь не найден' });
      }

      // Ищем refreshToken пользователя по user_id
      Token.findRefreshTokenByDeviceID(deviceID, (err, storedRefreshToken) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при поиске токена обновления по deviceID' });
        }

        console.log('storedRefreshToken', storedRefreshToken)
        console.log('refreshToken', decryptedRefreshToken)

        
        if (!compare(decryptedRefreshToken, storedRefreshToken)) { // Проверяем, совпадает ли оригинальное значение refreshToken с хешем в запросе
          return res.status(403).json({ message: 'Недействительный refresh токен' });
        }

        // Генерируем новый access токен
        const newAccessToken = generateAccessToken(user_id, deviceID);

        const encryptionKey = Buffer.from(ENCRYPTION_SECRET_KEY, 'hex'); // Преобразование из шестнадцатеричной строки в байтовый массив

        const encryptedAccessToken = encryptData(newAccessToken, encryptionKey); // Шифрование токенов перед сохранением

        Token.updateToken(deviceID, newAccessToken, storedRefreshToken, (err, updatedToken) => { // Обновляем access токен в базе данных для данного deviceID
          if (err) {
            console.error('Ошибка при обновлении токена:', err);
            return res.status(500).json({ message: 'Ошибка при обновлении токена' });
          }

          res.cookie('accessToken', encryptedAccessToken, { httpOnly: true }); // Устанавливаем куку с новым access токеном

          return res.status(200).json({ accessToken: encryptedAccessToken });
        });
      });
    });
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};




