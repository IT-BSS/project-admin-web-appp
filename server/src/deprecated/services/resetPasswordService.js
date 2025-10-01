//resetPasswordService.js
const nodemailer = require('nodemailer');
const { EMAIL_SERVICE_USER, EMAIL_SERVICE_PASS, EMAIL_SERVICE_SERVICE, FRONTEND_URL } = require('../utils/secrets');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
  // service: EMAIL_SERVICE_SERVICE,
  auth: {
    user: EMAIL_SERVICE_USER,
    pass: EMAIL_SERVICE_PASS,
  },
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

const generateResetEmailContent = (token) => `
  <p>Для сброса пароля перейдите по следующей ссылке:</p>
  <p><a href="${FRONTEND_URL}/reset-password/${token}">Сбросить пароль</a></p>
`;

const createMailOptions = (email, token) => {
  return {
    from: `Восстановление пароля <${EMAIL_SERVICE_USER}>`,
    to: email,
    subject: 'Сброс пароля',
    html: generateResetEmailContent(token),
  };
};

const sendResetEmail = async (email, token) => {
  try {
    const mailOptions = createMailOptions(email, token);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email отправлен:', info.response);
  } catch (error) {
    logger.error('Ошибка при отправке email:', error);
    throw error; // Проброс ошибки для обработки выше
  }
};

module.exports = {
  sendResetEmail,
};
