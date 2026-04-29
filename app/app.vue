<template>
  <div class="z-[-1]">
     <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template
>
<style>
/* 全局样式 */
html {
  overflow-y: auto;
  scrollbar-gutter: stable;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(71, 105, 177, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 105, 177, 0.5);
}
</style>