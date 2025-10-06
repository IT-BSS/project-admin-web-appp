// TODO: the repositories folder is a database access layer

import { query } from "../database/index.js";
import { User, RegisterUserDTO } from "../models/auth/userModel.js";

export const createUser = async (u: {
  guid: string;
  fio: string;
  birth_date: string | Date;
  email: string;
  phone: string;
  password_hash: string;
  salt_password: string;
}) => {
  const text = `
    INSERT INTO users (guid, fio, birth_date, email, phone, password_hash, salt_password)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING guid, fio, birth_date, email, phone, created_at, updated_at
  `;
  const values = [
    u.guid,
    u.fio,
    u.birth_date,
    u.email,
    u.phone,
    u.password_hash,
    u.salt_password,
  ];
  const res = await query(text, values);
  return res.rows[0] as Omit<User, "password_hash" | "salt_password">;
};

export const getUserByEmail = async (email: string) => {
  const res = await query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] as User | undefined;
};

export const getUserByGuid = async (guid: string) => {
  const res = await query("SELECT * FROM users WHERE guid = $1", [guid]);
  return res.rows[0] as User | undefined;
};

export const saveRefreshToken = async (guid: string, refreshToken: string | null) => {
  await query("UPDATE users SET refresh_token = $1, updated_at = now() WHERE guid = $2", [
    refreshToken,
    guid,
  ]);
};

export const getUserByRefreshToken = async (token: string) => {
  const res = await query("SELECT * FROM users WHERE refresh_token = $1", [token]);
  return res.rows[0] as User | undefined;
};

export const deleteRefreshToken = async (guid: string) => {
  await saveRefreshToken(guid, null);
};
