import db from '../utils/db'
import { comparePassword, generateToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({ statusCode: 400, message: '用户名和密码不能为空' })
  }

  const user = db.prepare(
    'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?'
  ).get(username, username) as { id: number; username: string; email: string; password: string } | undefined

  if (!user) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  const token = generateToken(user.id, user.username)

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
})