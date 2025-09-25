import bcrypt from 'bcryptjs';

// create hash for password and password
export const hashedPassword = async (password: string): Promise<string> =>
{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> =>
{
    return bcrypt.compare(password, hash);
};

