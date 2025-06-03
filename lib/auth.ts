import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define your custom payload type extending default JwtPayload
export interface JwtPayload extends DefaultJwtPayload {
  userId: number;
  email: string;
  twoFactorEnabled: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: number; email: string; twoFactorEnabled: boolean }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, JWT_SECRET) as JwtPayload | string;
}
