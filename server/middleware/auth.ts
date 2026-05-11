import jwt from 'jsonwebtoken'
import { createError, defineEventHandler, getHeader, getRequestURL } from 'h3'
import { prisma } from '../utils/prisma'
import { verifyToken } from '../utils/auth'
import type { AuthUser } from '../utils/auth'

const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jwt

function isProtectedRoute(method: string, path: string) {
  return (
    (method === 'GET' && path === '/api/dashboard/me') ||
    (method === 'POST' && path === '/api/posts/create') ||
    (method === 'POST' && /^\/api\/posts\/[^/]+\/comments\/create$/.test(path)) ||
    (method === 'DELETE' && /^\/api\/posts\/[^/]+$/.test(path)) ||
    (method === 'PATCH' && /^\/api\/posts\/visibility\/[^/]+$/.test(path))
  )
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const method = event.method.toUpperCase()

  if (!isProtectedRoute(method, path)) {
    return
  }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : ''

  if (!token) {
    throw createError({
      statusCode: 401,
      message: '请先登录'
    })
  }

  let tokenPayload: { id: number; username: string }

  try {
    tokenPayload = verifyToken(token)
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: '登录已过期，请重新登录'
      })
    }

    if (error instanceof NotBeforeError) {
      throw createError({
        statusCode: 401,
        message: '登录凭证尚未生效'
      })
    }

    if (error instanceof JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: '登录凭证无效，请重新登录'
      })
    }

    throw error
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.id },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '登录用户不存在，请重新登录'
    })
  }

  const authUser: AuthUser = user
  event.context.authUser = authUser
})
