import { prisma } from '../utils/prisma'
import { hashPassword } from '../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, email, password } = body

    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: '用户名、邮箱和密码不能为空'
      })
    }

    if (!/^[a-zA-Z0-9_]{4,16}$/.test(username)) {
      throw createError({
        statusCode: 400,
        message: '用户名只能包含字母、数字和下划线，且长度在4-16位之间'
      })
    }

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      throw createError({
        statusCode: 400,
        message: '邮箱格式不正确'
      })
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{6,20}$/.test(password)) {
      throw createError({
        statusCode: 400,
        message: '密码必须包含字母、数字，且长度在6-20位之间'
      })
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      },
      select: {
        id: true
      }
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        message: '用户名或邮箱已被注册'
      })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    })

    return user
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: '用户名或邮箱已存在'
      })
    }

    throw error
  }
})