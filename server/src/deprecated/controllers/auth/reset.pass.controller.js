//reset.pass.controller.js
const jwt = require('jsonwebtoken')
const { sendResetEmail } = require('../../services/resetPasswordService');
const { verify } = require('../../utils/token');
const { hash } = require('../../utils/password')
const User = require('../../models/auth/auth.model')
const ResetPasswordService = require('../../models/auth/user.model')
const { JWT_SECRET_KEY } = require('../../utils/secrets')

exports.resetPasswordRequest = (req, res) => {
  try {
    const { email } = req.body;

    User.findByEmail(email, (err, user) => {
      if (err || !user) {
        return res.status(403).json({ message: 'Пользователь с таким email не найден.' });
      }

      const { user_id } = user;

      const token = jwt.sign({ user_id }, JWT_SECRET_KEY, { expiresIn: '1h' });

      const expiresOn = new Date();
      expiresOn.setHours(expiresOn.getHours() + 1); // Токен действителен в течение 1 часа

      ResetPasswordService.create(user_id, token, expiresOn, (err, result) => {
        if (err) {
          console.error('Ошибка при создании токена сброса:', err);
          return res.status(500).json({ message: 'Произошла ошибка при сбросе пароля.' });
        }

        sendResetEmail(email, token); // Отправка email с токеном

        return res.status(200).json({ message: 'Инструкции по сбросу пароля отправлены на ваш email.' });
      });
    });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    return res.status(500).json({ message: 'Произошла ошибка при сбросе пароля.' });
  }
};


exports.resetPassword = (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Проверяем валидность токена и получаем user_id
    const tokenPayload = verify(token);

    const { user_id } = tokenPayload

    if (!tokenPayload || !user_id) {
      return res.status(403).json({ message: 'Неверный токен сброса пароля.' });
    }

    const hashedPassword = hash(newPassword)

    // Обновляем пароль в базе данных по user_id
    ResetPasswordService.updatePassword(user_id, hashedPassword, (err, result) => {
      if (err) {
        console.error('Ошибка при обновлении пароля:', err);
        return res.status(500).json({ message: 'Произошла ошибка при обновлении пароля.' });
      }
      ResetPasswordService.deleteExpiredTokensForUser(user_id, (err, result) => {
        if (err) {
          console.error('Ошибка при удалении использованных ранее попыток сброса пароля:', err);
          return res.status(500).json({ message: 'Произошла ошибка при удалении попыток сброса пароля.' });
        }
        ResetPasswordService.updateResetToken(token, user_id, (err) => {
          if (err) {
            console.error('Ошибка при обновлении токена сброса пароля:', err);
            return res.status(500).json({ message: 'Произошла ошибка при сбросе пароля.' });
          }

          return res.status(200).json({ message: 'Пароль успешно обновлен.' });
        });
      });
    });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    return res.status(500).json({ message: 'Произошла ошибка при сбросе пароля.' });
  }
};