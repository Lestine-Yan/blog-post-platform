import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    },
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
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  return posts
})