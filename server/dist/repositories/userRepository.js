import { query } from "../database/index.js";
export const createUser = async (u) => {
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
    return res.rows[0];
};
export const getUserByEmail = async (email) => {
    const res = await query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
};
export const getUserByGuid = async (guid) => {
    const res = await query("SELECT * FROM users WHERE guid = $1", [guid]);
    return res.rows[0];
};
export const saveRefreshToken = async (guid, refreshToken) => {
    await query("UPDATE users SET refresh_token = $1, updated_at = now() WHERE guid = $2", [
        refreshToken,
        guid,
    ]);
};
export const getUserByRefreshToken = async (token) => {
    const res = await query("SELECT * FROM users WHERE refresh_token = $1", [token]);
    return res.rows[0];
};
export const deleteRefreshToken = async (guid) => {
    await saveRefreshToken(guid, null);
};
//# sourceMappingURL=userRepository.js.map