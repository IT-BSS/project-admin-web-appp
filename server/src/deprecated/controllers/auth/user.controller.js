//user.controller.js
const Token = require('../../models/auth/token.model');
const User = require('../../models/auth/user.model');
const PasswordUtils = require('../../utils/password');

exports.getUsers = async (req, res) => {
  try {
    // Получаем токен из req.user (который мы устанавливаем в middleware verifyToken)
    const token = req.user;
    console.log('req.user token', token)

    // Используем модель Token для получения данных пользователя по токену
    Token.getUserDataByToken(token, (err, userData) => {
      if (err) {
        console.log('err', err)
        // Если произошла ошибка или токен недействителен, отправляем статус 403 (Forbidden)
        return res.sendStatus(403);
      }

      console.log(userData)

      // Если данные пользователя успешно найдены, отправляем их в ответ
      res.json(userData);
    });
  } catch (err) {
    // Обработка других ошибок, если таковые возникнут
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getActiveSessions = (req, res) => {
  // Используйте методы из вашего модуля Token для получения активных сессий
  Token.getActiveSessions((err, sessions) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении активных сессий' });
    }
    return res.status(200).json(sessions);
  });
};

exports.changePassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide current password and new password'
    });
  }

  const token = req.user;
  // Используем модель Token для получения данных пользователя по токену
  Token.getUserDataByToken(token, async (error, data) => {
    if (error) {
      return res.status(500).json({ status: 'error', message: 'Could not find user' });
    }

    const { user_id } = data;

    try {
      const passwordHash = await User.getPasswordByUserId(user_id);
      if (!PasswordUtils.compare(currentPassword, passwordHash)) {
        return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await PasswordUtils.hash(newPassword);
      await User.updatePassword(user_id, hashedNewPassword);

      return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Could not change password' });
    }
  });
};


exports.changeEmail = (req, res) => {
  const { email: newEmail } = req.body;

  if (!newEmail) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide new email'
    });
  }

  const token = req.user;
  Token.getUserDataByToken(token, (err, userData) => {
    if (err) {
      console.log('err', err)
      return res.status(500).json({ status: 'error', message: 'Could not find user' });
    }

    const { user_id } = userData;

    User.getEmailByUserId(user_id, (err, existingEmail) => {
      if (err) {
        console.log('err', err)
        return res.status(500).json({ status: 'error', message: 'Could not fetch email' });
      }

      if (existingEmail === newEmail) {
        return res.status(400).json({ status: 'error', message: 'This email is already used.' });
      }

      User.updateEmailByUserId(user_id, newEmail, (err) => {
        if (err) {
          console.log('err', err)
          return res.status(500).json({ status: 'error', message: 'Could not change email' });
        }

        return res.status(200).json({ status: 'success', message: 'Email updated successfully' });
      });
    });
  });
}