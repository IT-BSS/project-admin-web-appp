import jwt from 'jsonwebtoken'
import {JWT_SECRET, JWT_EXPIRATION} from '../../config';
import bcrypt from "bcryptjs";
import { query } from "../../database";
import { randomUUID } from "crypto";

export const registerUser = async (fio: string, birth_date: Date, email: string, phone: string, password: string) =>
{
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const guid = randomUUID();
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const insertQuery = `
        INSERT INTO users (guid, fio, birth_date, email, phone, password_hash, salt_password, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;

    const values = [guid, fio, birth_date, email, phone, passwordHash, salt, created_at, updated_at];

    try {
        const result = await query(insertQuery, values);
        return result.rows[0];
    } catch (error) {
        throw new Error("Error registering user: " + (error instanceof Error ? error.message : String(error)));
    }
}

export const loginUser = async (email: string, password: string)=>
{
    //find user from database
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user)
    {
        throw new Error("User not found");
    }

    // check valid password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid)
    {
        throw new Error('Invalid password');
    }

    // generate token with login
    const accessToken = jwt.sign({ userId: user.guid }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.guid }, JWT_SECRET, { expiresIn: '1d' });

    // update refresh_token from database
    await query("UPDATE users SET refresh_token = $1 WHERE guid = $2", [refreshToken, user.guid]);

    return {accessToken, refreshToken};
}

// this function future, for update password
export const updatePassword = async (guid: string, newPassword: string) =>
{
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const result = await query("SELECT * FROM users WHERE guid = $1", [guid]);
    const user = result.rows[0];
    
    if (!user)
    {
        throw new Error("User not found");
    }

    await query(
        "UPDATE users SET password_hash = $1, salt_password = $2 WHERE guid = $3",
        [newPasswordHash, salt, guid]
    );
}