declare const register: (dto: any) => Promise<Omit<import("../../models/auth/userModel.js").User, "password_hash" | "salt_password">>;
declare const login: (dto: any) => Promise<{
    user: {
        guid: string;
        fio: string;
        birth_date: Date;
        email: string;
        phone: string;
        created_at: Date;
        updated_at: Date;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}>;
declare const refreshTokens: (refreshToken: any) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const logout: (guid: any) => Promise<void>;
declare const getProfile: (guid: any) => Promise<{
    guid: string;
    fio: string;
    birth_date: Date;
    email: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
} | null>;
export { register, login, refreshTokens, logout, getProfile };
//# sourceMappingURL=authService.d.ts.map