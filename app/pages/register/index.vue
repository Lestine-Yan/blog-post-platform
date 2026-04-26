<template>
    <div class="bg-gray-100 border border-black/50 rounded-2xl m-24 p-4 h-[70dvh] w-[720px]">
        <div class="mx-auto flex flex-col items-center justify-center h-full">
            <h1 class="text-2xl text-black mb-8">注册</h1>
            <form @submit.prevent="handleRegister" class="flex flex-col gap-4 w-80">
                <div class="flex flex-col gap-2">
                    <label class="text-sm text-gray-600">用户名</label>
                    <input
                        v-model="form.username"
                        type="text"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="请输入用户名"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm text-gray-600">邮箱</label>
                    <input
                        v-model="form.email"
                        type="email"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="请输入邮箱"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm text-gray-600">密码</label>
                    <input
                        v-model="form.password"
                        type="password"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="请输入密码"
                    />
                </div>
                <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
                <button
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:bg-gray-400 transition-colors">
                    {{ loading ? '注册中...' : '注册' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const form = reactive({
    username: '',
    password: '',
    email: ''
})

const loading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
    errorMsg.value = ''

    if (!form.username || !form.password || !form.email) {
        errorMsg.value = '用户名、密码和邮箱不能为空'
        return
    }

    loading.value = true

    try {
        const res = await $fetch('/api/register', {
            method: 'POST',
            body: {
                username: form.username,
                email: form.email,
                password: form.password
            }
        })

        navigateTo('/login')
    } catch (error: any) {
        errorMsg.value = error.data?.message || '注册失败，请重试'
    } finally {
        loading.value = false
    }
}
</script>