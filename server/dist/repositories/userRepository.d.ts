import { User } from "../models/auth/userModel.js";
export declare const createUser: (u: {
    guid: string;
    fio: string;
    birth_date: string | Date;
    email: string;
    phone: string;
    password_hash: string;
    salt_password: string;
}) => Promise<Omit<User, "password_hash" | "salt_password">>;
export declare const getUserByEmail: (email: string) => Promise<User | undefined>;
export declare const getUserByGuid: (guid: string) => Promise<User | undefined>;
export declare const saveRefreshToken: (guid: string, refreshToken: string | null) => Promise<void>;
export declare const getUserByRefreshToken: (token: string) => Promise<User | undefined>;
export declare const deleteRefreshToken: (guid: string) => Promise<void>;
//# sourceMappingURL=userRepository.d.ts.map