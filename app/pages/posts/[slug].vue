<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div
        v-if="pending"
        class="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm"
      >
        加载中...
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600"
      >
        加载失败：{{ error.message }}
      </div>

      <article v-else-if="post" class="space-y-8">
        <header class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900">
            {{ post.title }}
          </h1>

          <p
            v-if="post.description"
            class="mt-4 text-base leading-7 text-gray-600"
          >
            {{ post.description }}
          </p>

          <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <span>作者：{{ post.author?.username || '未知作者' }}</span>
            <span>发布时间：{{ new Date(post.createdAt).toLocaleString() }}</span>
            <span>点赞：{{ post.likeCount }}</span>
            <span>评论：{{ post.comments?.length || 0 }}</span>
          </div>

          <div class="mt-6 flex items-center gap-4">
            <button
              @click="likePost"
              :disabled="liking"
              class="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ liking ? '点赞中...' : '点赞' }}
            </button>

            <span v-if="likeError" class="text-sm text-red-600">
              {{ likeError }}
            </span>
          </div>
        </header>

        <section
          class="prose prose-gray max-w-none rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          v-html="renderedContent"
        />

        <CommentList :comments="post.comments || []" />

        <CommentForm
          :post-id="post.id"
          @submitted="handleCommentSubmitted"
        />
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import type { LikeResponse, PostDetail } from '~/data/blog'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

const {
  data: post,
  pending,
  error,
  refresh
} = await useFetch<PostDetail>(() => `/api/posts/${slug.value}`)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return md.render(post.value.content)
})

const liking = ref(false)
const likeError = ref('')

const likePost = async () => {
  if (!post.value?.id) return

  likeError.value = ''

  try {
    liking.value = true

    const result = await $fetch<LikeResponse>(`/api/posts/like/${post.value.id}`, {
      method: 'POST'
    })

    if (post.value) {
      post.value.likeCount = result.likeCount
    }
  } catch (error: any) {
    likeError.value = error?.data?.message || '点赞失败'
  } finally {
    liking.value = false
  }
}

const handleCommentSubmitted = async () => {
  await refresh()
}

useSeoMeta({
  title: () => post.value?.title || '文章详情',
  description: () => post.value?.description || '博客文章详情'
})
</script>