<template>
  <article class="w-[720px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <NuxtLink :to="`/posts/${post.slug}`" class="group block">
      <h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
        {{ post.title }}
      </h2>
      
      <p
      v-if="post.description"
      class="mt-3 line-clamp-3 text-sm leading-7 text-gray-600"
      >
      {{ post.description }}
    </p>
    
    <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
      <span>作者：{{ post.author?.username || '未知作者' }}</span>
      <span>点赞：{{ post.likeCount }}</span>
      <span>评论：{{ post._count?.comments ?? 0 }}</span>
      <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
    </div>
  </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PostListItem } from '~/data/blog'

defineProps<{
  post: PostListItem
}>()
</script>