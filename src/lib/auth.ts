import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'brewops-super-secret-key-change-in-production';
}

export interface UserSession {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  tenantSlug: string;
}

/**
 * Encrypts a plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compares a plain password with a stored hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Creates a JWT token for a user session.
 */
export function signToken(session: UserSession): string {
  return jwt.sign(session, getJwtSecret(), { expiresIn: '7d' });
}

/**
 * Verifies and decodes a JWT token.
 * Returns null if invalid.
 */
export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserSession;
  } catch (error) {
    return null;
  }
}

/**
 * Decodes a token without verifying signature (useful for checking user details on client side).
 */
export function decodeToken(token: string): UserSession | null {
  try {
    return jwt.decode(token) as UserSession;
  } catch {
    return null;
  }
}
