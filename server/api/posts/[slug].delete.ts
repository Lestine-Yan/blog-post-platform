import { prisma } from '../../utils/prisma'
import { requireAuthUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuthUser(event)
  const idParam = getRouterParam(event, 'slug')
  const id = Number(idParam)

  if (!idParam || !Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: '文章ID无效'
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
      message: '无权删除此文章'
    })
  }

  await prisma.post.delete({
    where: { id }
  })

  return {
    success: true,
    id
  }
})
