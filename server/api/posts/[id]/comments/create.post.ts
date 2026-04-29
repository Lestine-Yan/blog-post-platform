// server/api/posts/[id]/comments/create.post.ts
import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { content, authorId } = body

  if (!postId || !content) {
    throw createError({
      statusCode: 400,
      message: '参数不完整'
    })
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: Number(postId),
      authorId: authorId ? Number(authorId) : null
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