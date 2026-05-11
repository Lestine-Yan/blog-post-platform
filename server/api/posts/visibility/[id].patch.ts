import { prisma } from '../../../utils/prisma'
import { requireAuthUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuthUser(event)
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || !Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: '文章ID无效'
    })
  }

  const body = await readBody(event)

  if (typeof body.published !== 'boolean') {
    throw createError({
      statusCode: 400,
      message: '发布状态必须是布尔值'
    })
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      authorId: true
    }
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      message: '文章不存在'
    })
  }

  if (post.authorId !== authUser.id) {
    throw createError({
      statusCode: 403,
      message: '无权修改此文章'
    })
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      published: body.published
    },
    select: {
      id: true,
      published: true,
      updatedAt: true
    }
  })

  return {
    success: true,
    post: updatedPost
  }
})
