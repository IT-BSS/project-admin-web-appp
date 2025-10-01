//checkEmail.js
const User = require('../models/auth/auth.model');

const checkEmail =  (req, res, next) => {
    const { email } = req.body;
    User.findByEmail(email, (_, data) => {
        if (data) {
            res.status(400).send({
                status: 'error',
                message: `Пользователь с адресом электронной почты '${email}' уже существует.`
            });
            return;
        }
        next();
    });
}

module.exports = checkEmail;