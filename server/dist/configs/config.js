import dotenv from 'dotenv';
dotenv.config();
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not set. Using default value. Change this in production!');
}
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
//# sourceMappingURL=config.js.map