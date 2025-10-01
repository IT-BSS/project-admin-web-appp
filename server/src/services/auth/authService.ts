// src/services/authService.ts
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  createUser,
  getUserByEmail,
  saveRefreshToken,
  getUserByRefreshToken,
  deleteRefreshToken,
  getUserByGuid,
} from "../../repositories/userRepository.js";
import {
  RegisterUserDTO,
  LoginUserDTO,
  UserResponse,
  AuthTokens,
} from "../../models/auth/userModel.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt.js";

const SALT_ROUNDS = 12;

const register = async (dto: any) => {
  const existing = await getUserByEmail(dto.email);
  if (existing) throw new Error("Email already in use");

  const guid = uuidv4();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(dto.password, salt);

  const user = await createUser({
    guid,
    fio: dto.fio,
    birth_date: dto.birth_date,
    email: dto.email,
    phone: dto.phone,
    password_hash: hash,
    salt_password: salt,
  });

  return user;
};

const login = async (dto: any) => {
  const user = await getUserByEmail(dto.email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(dto.password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");

  const payload = { guid: user.guid, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await saveRefreshToken(user.guid, refreshToken);

  const userResp = {
    guid: user.guid,
    fio: user.fio,
    birth_date: user.birth_date,
    email: user.email,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user: userResp, tokens: { accessToken, refreshToken } };
};

const refreshTokens = async (refreshToken: any) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded === 'string' || !decoded?.guid) throw new Error("Invalid token payload");

    // ensure token exists in DB
    const user = await getUserByRefreshToken(refreshToken);
    if (!user || user.guid !== decoded.guid) throw new Error("Invalid refresh token");

    const payload = { guid: user.guid, email: user.email };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

    await saveRefreshToken(user.guid, newRefresh);

    return { accessToken: newAccess, refreshToken: newRefresh };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};

const logout = async (guid: any) => {
  await deleteRefreshToken(guid);
};

const getProfile = async (guid: any) => {
  const user = await getUserByGuid(guid);
  if (!user) return null;
  return {
    guid: user.guid,
    fio: user.fio,
    birth_date: user.birth_date,
    email: user.email,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export {
  register,
  login,
  refreshTokens,
  logout,
  getProfile
};