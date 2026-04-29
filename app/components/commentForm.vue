<template>
  <section class="mt-10">
    <h3 class="mb-4 text-xl font-semibold text-gray-900">发表评论</h3>

    <div
      v-if="!authStore.isAuthenticated || !authStore.user"
      class="rounded-2xl border border-amber-200 bg-amber-50 p-6"
    >
      <p class="text-sm text-amber-800">
        请先登录后再发表评论。
      </p>
      <button
        type="button"
        @click="goLogin"
        class="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
      >
        去登录
      </button>
    </div>

    <form
      v-else
      @submit.prevent="submitComment"
      class="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >

      <div>
        <label for="content" class="mb-2 block text-sm font-medium text-gray-700">
          评论内容
        </label>
        <textarea
          id="content"
          v-model="content"
          rows="5"
          placeholder="写下你的评论..."
          class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500"
        />
      </div>

      <div class="flex items-center gap-4">
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ submitting ? '提交中...' : '提交评论' }}
        </button>

        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  postId: number
}>()

const emit = defineEmits<{
  submitted: []
}>()

const authStore = useAuthStore()
const content = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const goLogin = async () => {
  await navigateTo('/login')
}

const submitComment = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!authStore.isAuthenticated || !authStore.user?.id) {
    errorMessage.value = '请先登录后再发表评论'
    return
  }

  if (!content.value.trim()) {
    errorMessage.value = '评论内容不能为空'
    return
  }

  try {
    submitting.value = true

    await $fetch(`/api/posts/${props.postId}/comments/create`, {
      method: 'POST',
      body: {
        content: content.value,
        authorId: authStore.user.id
      },
      headers: authStore.token
        ? {
            Authorization: `Bearer ${authStore.token}`
          }
        : undefined
    })

    content.value = ''
    successMessage.value = '评论发表成功'
    emit('submitted')
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.data?.statusMessage || '评论提交失败'
  } finally {
    submitting.value = false
  }
}
</script>