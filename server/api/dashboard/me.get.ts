import { prisma } from '../../utils/prisma'
import { requireAuthUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = requireAuthUser(event)

  const posts = await prisma.post.findMany({
    where: {
      authorId: authUser.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      published: true,
      likeCount: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true
        }
      }
    }
  })

  return {
    user: authUser,
    posts
  }
})
