<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            博文列表
          </h1>
          <p class="mt-2 text-sm text-gray-500">
            浏览所有已发布的文章
          </p>
        </div>

        <button
          @click="handleRefresh"
          class="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          刷新
        </button>
      </div>

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

      <div
        v-else-if="!posts || posts.length === 0"
        class="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500"
      >
        还没有已发布的文章
      </div>

      <div v-else class="grid gap-5">
        <BlogPostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PostListItem } from '~/data/blog'

const {
  data: posts,
  pending,
  error,
  refresh
} = await useFetch<PostListItem[]>('/api/posts/postlist', {
  default: () => []
})

const handleRefresh = async () => {
  await refresh()
}

useSeoMeta({
  title: '博文列表',
  description: '查看所有博客文章'
})
</script>