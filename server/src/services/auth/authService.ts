import jwt from 'jsonwebtoken'
import {JWT_SECRET, JWT_EXPIRATION} from '../../../config';
import {hashedPassword, comparePassword} from "@/utils/auth/authUtils";
import bcrypt from "bcryptjs";
import { User } from "@/models/auth/user.model";

export const registerUser = async (fio: string, birth_day: any, email: string, phone: number, password: string) =>
{
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await User.create
    ({
        fio, email, birth_day, phone,
        passwordHash: passwordHash,
        salt_password: salt
    })

    return user;
}

export const loginUser = async (email: string, password: string)=>
{
    //find user from database
    const user = await User.findOne({ where: email });

    if (!user)
    {
        throw new Error("User already exists");
    }

    // check valid. password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid)
    {
        throw new Error('Uncerded password');
    }

    // generate token with login
    const accessToken = jwt.sign({ userId: user.guid }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.guid }, JWT_SECRET, { expiresIn: '1d' });

    // update refresh_token from database
    await user.update({refreshToken: refreshToken});

    return {accessToken, refreshToken};
}

// this function future, for update password
export const updatePassword = async (guid: string, newPassword: string) =>
{
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const user = await User.findOne({ where: guid });
    if (!user)
    {
        throw new Error("User already exists");
    }

    await user.update
    ({
        password_hash: newPasswordHash,
        salt_password: salt
    })
}