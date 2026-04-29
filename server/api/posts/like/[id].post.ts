import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少文章id'
    })
  }

  const post = await prisma.post.update({
    where: {
      id: Number(id)
    },
    data: {
      likeCount: {
        increment: 1
      }
    }
  })

  return {
    success: true,
    likeCount: post.likeCount
  }
})