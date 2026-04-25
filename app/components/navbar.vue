<template>
    <div class="bg-black py-4 z-50 flex w-full-no-scrollbar">
        <div class="m-0 flex w-auto px-0 ml-8">
                <NuxtLink to="/" class = "text-white mr-4">首页</NuxtLink>
                <div class="w-[80dvw]"></div>
                <NuxtLink to="/login" class = "text-white ">登录</NuxtLink>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
</script>