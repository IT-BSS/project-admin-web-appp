import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { pool } from '@/database/index';
import {JWT_SECRET, JWT_EXPIRATION} from "@/configs/config";
import {User} from "@/models/auth/userModel";

export const registerUser = async (fio: string, birth_date: Date, email: string, phone: string, password: string): Promise<User> => {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // TODO: Put it in the function
    const result = await pool.query(
        'INSERT INTO users (fio, birth_date, email, phone, password_hash, salt_password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [fio, birth_date, email, phone, passwordHash, salt]
    );

    return result.rows[0];
};

export const loginUser = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> =>
{
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = await result.rows[0];

    if (!user)
    {
        throw new Error('User not found');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid)
    {
        throw new Error('Invalid password');
    }

    const accessToken = jwt.sign({userId: user.guid}, JWT_SECRET, {expiresIn: '1d'});
    const refreshToken = jwt.sign({userId: user.guid}, JWT_SECRET, {expiresIn: '7d'});

    await pool.query('UPDATE users SET refresh_token = $1 WHERE guid = $2', [refreshToken, user.guid]);

    return {accessToken, refreshToken};
}

