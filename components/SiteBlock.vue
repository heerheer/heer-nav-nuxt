<template>
  <div class="site-block">
    <div class="content gap-2 flex items-center w-full p-3">
      <div class="aspect-square w-1/5">
        <UAvatar
          class="w-full h-full"
          :src="getAvatar()"
          :alt="props.site.name"
        />
      </div>
      <!-- 文本容器 -->
      <div class="flex flex-col gap-1 w-4/5">
        <div class="font-bold">{{ props.site.name }}</div>
        <div class="text-sm">{{ props.site.desc }}</div>
        <div class="flex gap-2">
          <UBadge
            size="xs"
            :color="getBadgeColor(tag)"
            variant="subtle"
            v-for="tag in props.site.tags"
            :key="tag"
            :label="tag"
          >
          </UBadge>
        </div>
      </div>
    </div>

    <!-- 加密区域 -->
    <div
      v-if="props.site.encrypted && !edit"
      class="overlay absolute w-full h-full bg-white/30 backdrop-blur-sm flex flex-col justify-center items-center gap-2"
    >
      <div class="font-bold">
        {{ props.site.name }}
      </div>
      <UButton size="xs">使用密码解锁</UButton>
    </div>

    <div
      v-if="edit"
      id="edit-panel"
      class="hidden absolute top-0 right-0 p-2 flex-row-reverse gap-1"
    >
      <UButton
        icon="ri-edit-2-line"
        class="px-1"
        variant="ghost"
        @click="emits('editSite', site)"
      />
      <UButton
        icon="ri-delete-bin-6-line"
        class="px-1"
        color="red"
        variant="ghost"
        @click="emits('deleteSite', site)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const emits = defineEmits<{
  'editSite':[site:Site],
  'deleteSite': [site:Site]
}>();

import type { Site } from "~/shared.types";

const props = defineProps<{ site: Site }>();

// pinia状态管理
const store = useModeStore();
const { edit } = storeToRefs(store);

const getBadgeColor = (tag: string) => {
  switch (tag) {
    case "Free":
      return "green";
    case "Proxy":
      return "red";
    default:
      return "white";
  }
};

const getAvatar = () => {
  if (props.site.avatar) {
    return props.site.avatar.url;
  } else {
    return (
      "https://www.google.com/s2/favicons?domain=" + props.site.url + "&sz=256"
    );
  }
};
</script>
<style>
.site-block {
  @apply relative 
    w-full h-full hover:bg-white hover:rounded-lg 
    hover:shadow flex items-center;
}

.site-block:hover #edit-panel {
  display: flex;
}
</style>
