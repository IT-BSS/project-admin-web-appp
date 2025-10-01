import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || 'keeeeeeeeeeeeeeyyyyyyyyyyyy';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
//# sourceMappingURL=config.js.map