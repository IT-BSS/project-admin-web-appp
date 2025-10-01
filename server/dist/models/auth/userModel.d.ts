export interface User {
    guid: string;
    fio: string;
    birth_date: Date;
    email: string;
    phone: string;
    password_hash: string;
    refresh_token?: string | null;
    salt_password: string;
    created_at: Date;
    updated_at: Date;
}
export interface UserResponse {
    guid: string;
    fio: string;
    birth_date: Date;
    email: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
}
export interface RegisterUserDTO {
    fio: string;
    birth_date: string | Date;
    email: string;
    phone: string;
    password: string;
}
export interface LoginUserDTO {
    email: string;
    password: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
//# sourceMappingURL=userModel.d.ts.map