//emailConfirmationService.js
const nodemailer = require('nodemailer');
const { EMAIL_SERVICE_USER, EMAIL_SERVICE_PASS, FRONTEND_URL } = require('../utils/secrets');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
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

const generateEmailConfirmationContent = (token) => `
    <p>Для подтверждения вашей электронной почты перейдите по следующей ссылке:</p>
    <p><a href="${FRONTEND_URL}/email-confirmation/${token}">Подтвердить почту</a></p>
`;

const createMailOptions = (email, token) => {
    return {
        from: `Подтверждение почты <${EMAIL_SERVICE_USER}>`,
        to: email,
        subject: 'Подтверждение почты',
        html: generateEmailConfirmationContent(token),
    };
};

const sendConfirmationEmail = async (email, token) => {
    try {
        const mailOptions = createMailOptions(email, token);

        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', info.response);
    } catch (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
};

module.exports = {
    sendConfirmationEmail,
};
