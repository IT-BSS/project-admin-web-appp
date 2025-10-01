//auth.js
import type { NextFunction } from "express";
const Joi = require('joi');
const validatorHandler = require('../../middlewares/validatorHandler');

const signup = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        firstname: Joi.string()
            .min(2)
            .required(),
        lastname: Joi.string()
            .min(2)
            .required(),
        birthDay: Joi.number(),
            // .required(),
        birthMonth: Joi.string(),
            // .required(),
        birthYear: Joi.number(),
            // .required(),
        password: Joi.string()
            .min(6)
            .max(40)
            .required(),
        passwordConfirm: Joi.string()
            .valid(Joi.ref('password'))
            .required(),
        phone: Joi.string()
            .regex(/[0-9-]+/)
            .min(9)
            .required(),
        email: Joi.string()
            .email()
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            .required(),
        country: Joi.string()
            .required(),
        city: Joi.string()
            .required(),
        // checkbox: Joi.boolean()
        //     .valid(true)
        //     .required(),
        sex: Joi.string()
            .valid('Мужской', 'Женский')
            .required(),
    });
    validatorHandler(req, res, next, schema);
};
// const passwordPattern = new RegExp(
//     '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,30}$'
//   );
// Тестовые данные
// const data = {
//     password: 'StrongP@ssw0rd',
//   };

const signin = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        email: Joi.string()
            .trim()
            .email()
            .required(),
        password: Joi.string()
            .trim()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .required()
    });
    validatorHandler(req, res, next, schema);
};

module.exports = {
    signup,
    signin
};