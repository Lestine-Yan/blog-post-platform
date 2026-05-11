import { prisma } from '../../../../utils/prisma'
import { requireAuthUser } from '../../../../utils/auth'

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

  const authUser = requireAuthUser(event)

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      authorId: authUser.id
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