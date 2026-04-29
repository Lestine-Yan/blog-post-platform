// server/api/posts/[slug].get.ts
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: '缺少slug'
    })
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      comments: {
        orderBy: {
          createdAt: 'desc'
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
      }
    }
  })

  if (!post || !post.published) {
    throw createError({
      statusCode: 404,
      message: '文章不存在'
    })
  }

  return post
})