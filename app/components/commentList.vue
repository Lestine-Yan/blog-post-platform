<template>
  <section class="mt-10">
    <h3 class="mb-4 text-xl font-semibold text-gray-900">评论区</h3>

    <div
      v-if="!comments.length"
      class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500"
    >
      暂无评论，来抢沙发吧～
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div class="mb-2 flex items-center justify-between gap-4">
          <strong class="text-sm text-gray-900">
            {{ comment.author?.username || '匿名用户' }}
          </strong>
          <span class="text-xs text-gray-500">
            {{ new Date(comment.createdAt).toLocaleString() }}
          </span>
        </div>

        <p class="whitespace-pre-wrap text-sm leading-7 text-gray-700">
          {{ comment.content }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CommentItem } from '~/data/blog'

defineProps<{
  comments: CommentItem[]
}>()
</script>