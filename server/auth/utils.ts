import bcrypt from 'bcryptjs';
import { db } from '@/server/db'

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export function saltAndHashPassword(password: string): string {
  const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
  return bcrypt.hashSync(password, saltRounds)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

// Get user from database (mock implementation - replace with your DB logic)
export async function getUserFromDb(email: string) {
    const user = await db.user.findUnique({
        where: { email }
    });
    return user;
}

// Get user by ID from database
export async function getUserById(id: string) {
    const user = await db.user.findUnique({
        where: { id }
    });
    return user;
}