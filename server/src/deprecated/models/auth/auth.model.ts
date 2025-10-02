//auth.model.js
const db = require('../../config/db.config');
const { createNewUser: createNewUserQuery, findUserByEmail: findUserByEmailQuery, findByEmailAndCheckVerifyEmail:findByEmailAndCheckVerifyEmailQuery } = require('../../database/queries');
const { logger } = require('../../utils/logger');

export class User {
    guid: string;
    firstname: string;
    lastname: string;
    middlename: string;
    birthday: string;
    email: string;
    password: string;
    phone: string;

    constructor(guid: string,
        firstname: string, 
            lastname: string, 
            middlename: string,
            birthday: string, 
            email: string, 
            password: string, 
            phone: string) {
        this.guid = guid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.middlename = middlename;
        this.birthday = birthday;

        this.email = email,
        this.password = password,
        this.phone = phone
    }

    static create(newUser: User, cb: any) {
        console.log('newUser', newUser)
        db.query(createNewUserQuery,
            [
                newUser.firstname,
                newUser.lastname,
                newUser.sex,
                newUser.birthDay,
                newUser.birthMonth,
                newUser.birthYear,
                newUser.country,
                newUser.city,
                newUser.email,
                newUser.password,
                newUser.phone
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    user_id: res.insertId,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    sex: newUser.sex,
                    birthDay: newUser.birthDay,
                    birthMonth: newUser.birthMonth,
                    birthYear: newUser.birthYear,
                    country: newUser.country,
                    city: newUser.city,
                    email: newUser.email,
                    password: newUser.password,
                    phone: newUser.phone
                });
            });
    }

    static findByEmail(email, cb) {
        db.query(findUserByEmailQuery, email, (err, res) => {
            console.log('static findByEmail res', res)
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }
}