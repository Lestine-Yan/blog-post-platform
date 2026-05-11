import slugify from 'slugify'
import { prisma } from '../../utils/prisma'
import { requireAuthUser } from '../../utils/auth'

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

  const authUser = requireAuthUser(event)

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
    post
  }
})