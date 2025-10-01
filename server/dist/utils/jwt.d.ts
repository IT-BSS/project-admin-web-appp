export declare const signAccessToken: (payload: object) => string;
export declare const signRefreshToken: (payload: object) => string;
import { JwtPayload } from "jsonwebtoken";
export declare const verifyAccessToken: (token: string) => JwtPayload | string;
export declare const verifyRefreshToken: (token: string) => JwtPayload | string;
//# sourceMappingURL=jwt.d.ts.map