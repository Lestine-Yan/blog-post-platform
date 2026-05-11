import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createError } from 'h3'
import type { H3Event } from 'h3'

export interface AuthUser {
  id: number
  username: string
  email: string
  avatar: string | null
  createdAt: Date
}

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || '0d000721'
const JWT_EXPIRES_IN = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign(
    { id: userId, username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token: string): { id: number; username: string } {
  return jwt.verify(token, JWT_SECRET) as { id: number; username: string }
}

export function requireAuthUser(event: H3Event): AuthUser {
  const authUser = event.context.authUser as AuthUser | undefined

  if (!authUser) {
    throw createError({
      statusCode: 401,
      message: '请先登录'
    })
  }

  return authUser
}