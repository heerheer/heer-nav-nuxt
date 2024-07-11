<template>
  <div v-if="edit" class="flex gap-1 items-center">
    <UInput v-model="text" :placeholder="props.placeholder" size="xs"  />
    <UButton
      @click="
        emits('complete', text);
        edit = false;
      "
      icon="ri-check-line"
      variant="ghost"
      title="确认"
    ></UButton>
    <UButton
      @click="edit = false"
      icon="ri-close-line"
      variant="ghost"
      title="取消"
    ></UButton>
  </div>
  <div v-else>
    <UButton @click="edit = true" :icon="props.icon" class="p-1" >
      <slot></slot>
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["complete"]);
const props = defineProps<{ icon?: string; placeholder?: string }>();

const text = ref("");
const edit = ref(false);
</script>

<style></style>
