//EmailConfirmationController.js
const { verify } = require('../../utils/token');
const Token = require('../../models/auth/token.model');
const ResetPasswordService = require('../../models/auth/user.model');
const User = require('../../models/auth/auth.model');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../../services/emailConfirmationService')
const { hash: hashPassword, compare: comparePassword } = require('../../utils/password');
const { generateAccessToken, generateRefreshToken, generateDeviceID } = require('../../utils/token');
const { encryptData, decryptData } = require('../../utils/crypt')
const { ENCRYPTION_SECRET_KEY, JWT_SECRET_KEY } = require('../../utils/secrets');

exports.emailConfirmation = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Требуется указать токен' });
  }

  const decoded = verify(token);

  const { user_id } = decoded;

  Token.findUserById(user_id, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ message: 'Пользователь не найден' });
    }

    ResetPasswordService.checkEmailConfirmationToken(token, (err, storedToken) => {
      if (err) {
        return res.status(500).json({ message: 'Данные не найдены или недействительны' });
      }

      // Проверяем, совпадает ли переданный токен с токеном из базы данных
      if (token !== storedToken) {
        return res.status(403).json({ message: 'Неверный токен' });
      }

      ResetPasswordService.updateEmailConfirmedToken(token, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Произошла ошибка при обновлении данных' });
        }

        ResetPasswordService.setEmailConfirmedStatus(user_id, (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Произошла ошибка при обновлении статуса пользователя' });
          }
          res.status(200).json({ message: 'Email успешно подтвержден' });
        });
      });
    });
  });
};

exports.resendConfirmationEmail = (req, res) => {
  const { email } = req.body;
  User.findByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ message: 'Пользователь не найден' });
    }
    const { user_id } = user;
    
    const confirmationToken = jwt.sign({ user_id }, JWT_SECRET_KEY, { expiresIn: '12h' });

    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 12); // Токен действителен в течение 12 часов

    ResetPasswordService.createEmailConfirmedToken(user_id, confirmationToken, expiresOn, (err, tokenData) => {
      if (err) {
        return res.status(500).json({ message: 'Произошла ошибка при добавлении данных' });
      }
      sendConfirmationEmail(email, confirmationToken)
        .then(() => {
          res.status(201).send({
            status: "Успешно",
            message: "Письмо с подтверждением успешно отправлено.",
          });
        })
        .catch((error) => {
          res.status(500).send({
            status: 'Ошибка',
            message: 'Не удалось отправить письмо с подтверждением.',
          });
        });
    })
  })
}

