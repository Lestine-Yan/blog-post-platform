import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim() : ''

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } }
            ]
          }
        : {})
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
