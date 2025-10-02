// src/controller/auth/authController.ts
import type { RegisterUserDTO, LoginUserDTO } from "../../models/auth/userModel.js";
import type { Request, Response } from "express";
import * as authService from "../../services/auth/authService.js";

export const registerHandler = async (req: any, res: any) => {
  try {
    const dto = req.body as RegisterUserDTO;
    const user = await authService.register(dto); // Вызов через authService
    return res.status(201).json({ user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const loginHandler = async (req: any, res: any) => {
  try {
    const dto = req.body as LoginUserDTO;
    const result = await authService.login(dto); // Вызов через authService
    res.cookie('accessToken', result.tokens.accessToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 }); // 1 час
    res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 604800000 }); // 7 дней
    return res.json({ user: result.user });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};

export const refreshHandler = async (req: any, res: any) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: "refreshToken required" });
    const tokens = await authService.refreshTokens(refreshToken); // Вызов через authService
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 604800000 });
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};

export const logoutHandler = async (req: any, res: any) => {
  try {
    const userGuid = (req as any).user?.guid;
    if (!userGuid) return res.status(401).json({ error: "Not authenticated" });
    await authService.logout(userGuid); // Вызов через authService
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const profileHandler = async (req: any, res: any) => {
  try {
    const userGuid = (req as any).user?.guid;
    if (!userGuid) return res.status(401).json({ error: "Not authenticated" });
    const profile = await authService.getProfile(userGuid); // Вызов через authService
    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};