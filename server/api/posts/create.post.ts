import slugify from 'slugify'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { prisma } from '../../utils/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    title,
    description = '',
    content,
    published = true
  } = body

  if (!title || !content) {
    throw createError({
      statusCode: 400,
      message: '标题、内容不能为空'
    })
  }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : ''

  if (!token) {
    throw createError({
      statusCode: 401,
      message: '请先登录后再发布文章'
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

  let slug =
    slugify(title, { lower: true, strict: true }) ||
    `post-${Date.now()}`

  const exists = await prisma.post.findUnique({
    where: { slug }
  })

  if (exists) {
    slug = `${slug}-${Date.now()}`
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      description,
      content,
      published,
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
    post
  }
})