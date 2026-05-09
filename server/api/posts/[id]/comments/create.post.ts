import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { prisma } from '../../../../utils/prisma'
import { verifyToken } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { content } = body

  if (!postId || !content) {
    throw createError({
      statusCode: 400,
      message: '参数不完整'
    })
  }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : ''

  if (!token) {
    throw createError({
      statusCode: 401,
      message: '请先登录后再发表评论'
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

  const author = await prisma.user.findUnique({
    where: { username: tokenPayload.username },
    select: {
      id: true,
      username: true,
      avatar: true
    }
  })

  if (!author) {
    throw createError({
      statusCode: 401,
      message: '登录用户不存在'
    })
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      authorId: author.id
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      }
    }
  })

  return {
    success: true,
    comment
  }
})