import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'keeeeeeeeeeeeeeyyyyyyyyyyyy';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d'; //
