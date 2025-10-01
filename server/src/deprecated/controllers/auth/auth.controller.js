//auth.controller.js
const User = require('../../models/auth/auth.model');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../../services/emailConfirmationService')
const { hash: hashPassword, compare: comparePassword } = require('../../utils/password');
const { generateAccessToken, generateRefreshToken, generateDeviceID } = require('../../utils/token');
const { encryptData, decryptData } = require('../../utils/crypt')
const Token = require('../../models/auth/token.model');
const { ENCRYPTION_SECRET_KEY, JWT_SECRET_KEY } = require('../../utils/secrets');
const ResetPasswordService = require('../../models/auth/user.model');

exports.signup = (req, res) => {
    const { firstname, lastname, sex, birthDay, birthMonth, birthYear, country, city, email, password, phone } = req.body;
    console.log('req.body', req.body)
    console.log('firstname', firstname)
    console.log('lastname', lastname)
    console.log('sex', sex)
    console.log('birthDay', birthDay)
    console.log('birthMonth', birthMonth)
    console.log('birthYear', birthYear)
    console.log('country', country)
    console.log('city', city)
    console.log('email', email)
    console.log('password', password)
    console.log('phone', phone)


    const hashedPassword = hashPassword(password.trim());
    const user = new User(firstname.trim(), lastname.trim(), sex.trim(), birthDay.trim(), birthMonth.trim(), birthYear.trim(), country.trim(), city.trim(), email.trim(), hashedPassword, phone.trim());
    console.log('user signup', user)
    User.create(user, (err, data) => {
        if (err) {
            return res.status(500).send({
                status: "Ошибка",
                message: "Ошибка при создании аккаунта: " + err.message
            });
        }

        const confirmationToken = jwt.sign({ user_id: data.user_id }, JWT_SECRET_KEY, { expiresIn: '12h' });

        const expiresOn = new Date();
        expiresOn.setHours(expiresOn.getHours() + 12); // Токен действителен в течение 12 часов

        ResetPasswordService.createEmailConfirmedToken(data.user_id, confirmationToken, expiresOn, (err, tokenData) => {
            if (err) {
                return res.status(500).send({
                    status: 'Ошибка',
                    message: 'Не удалось сохранить данные',
                });
            }

            sendConfirmationEmail(data.email, confirmationToken)
                .then(() => {
                    res.status(201).send({
                        status: "Успешно",
                        message: "Аккаунт создан. Письмо с подтверждением отправлено.",
                    });
                })
                .catch((error) => {
                    res.status(500).send({
                        status: 'Ошибка',
                        message: 'Не удалось отправить письмо с подтверждением.',
                    });
                });
        });
    });
};


exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email.trim(), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'Ошибка',
                    message: `Пользователь с адресом электронной почты ${email} не найден`
                });
                return;
            }
            res.status(500).send({
                status: 'Ошибка',
                message: 'Ошибка сервера: ' + err.message
            });
            return;
        }
        if (data) {
            console.log('data', data)
            if (comparePassword(password.trim(), data.password)) {

                if (data.is_email_confirmed === 0) {
                    res.status(401).send({
                        status: 'Ошибка',
                        message: 'Адрес электронной почты не подтвержден',
                        email: email
                    });
                    return;
                }

                const deviceID = generateDeviceID();
                const accessToken = generateAccessToken(data.user_id, deviceID);
                const refreshToken = generateRefreshToken(data.user_id, deviceID);
                console.log('accessToken', accessToken)
                console.log('refreshToken', refreshToken)
                console.log('deviceID', deviceID)

                const hashRefreshToken = hashPassword(refreshToken.trim())

                const encryptionKey = Buffer.from(ENCRYPTION_SECRET_KEY, 'hex'); // Преобразование из шестнадцатеричной строки в байтовый массив
                console.log('encryptionKey encryptionKey encryptionKey encryptionKey', encryptionKey)
                // Шифрование токенов перед сохранением
                const encryptedAccessToken = encryptData(accessToken, encryptionKey);
                const encryptedRefreshToken = encryptData(refreshToken, encryptionKey);

                if (!accessToken || !refreshToken) {
                    res.status(500).send({
                        status: 'Ошибка',
                        message: 'Не удалось сгенерировать токены'
                    });
                    return;
                }

                // Добавляем токены в базу данных
                Token.create({ accessToken, refreshToken: hashRefreshToken, deviceID, user_id: data.user_id }, (err, tokenData) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send({
                            status: 'Ошибка',
                            message: 'Не удалось сохранить токены в базе данных'
                        });
                        return;
                    }

                    // Устанавливаем куки с токенами
                    res.cookie('accessToken', encryptedAccessToken, { httpOnly: true });
                    res.cookie('refreshToken', encryptedRefreshToken, { httpOnly: true });

                    res.status(200).send({
                        status: 'Успешно',
                    });
                });

                return;
            }
            res.status(401).send({
                status: 'Ошибка',
                message: 'Неверный пароль'
            });
        }
    });
};