// server/api/posts/create.post.ts
import slugify from 'slugify'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    title,
    description = '',
    content,
    published = true,
    authorId
  } = body

  if (!title || !content || !authorId) {
    throw createError({
      statusCode: 400,
      message: '标题、内容、作者不能为空'
    })
  }

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
      authorId: Number(authorId)
    },
    include: {
      author: true
    }
  })

  return {
    success: true,
    post
  }
})