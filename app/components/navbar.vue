<template>
    <div class="bg-black py-4 z-50 flex w-full-no-scrollbar">
        <div class="m-0 flex w-auto px-0 ml-8">
                <NuxtLink to="/" class = "text-white mr-4">首页</NuxtLink>
                <NuxtLink to="/posts" class = "text-white mr-4">博文列表</NuxtLink>
                <div class="w-[80dvw]"></div>
                <NuxtLink to="/login" class = "text-white mr-4">登录</NuxtLink>
                <NuxtLink to="/dashboard" class = "text-white mr-4">仪表盘</NuxtLink>
                <NuxtLink to="/createPost" class = "text-white">发布</NuxtLink>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
</script>