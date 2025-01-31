<template>
  <div v-if="edit" class="flex gap-1 items-center">
    <UInput v-model="localText" :placeholder="props.placeholder" size="xs" />
    <UButton @click="
      emits('complete', localText);
    edit = false;
    " icon="ri-check-line" variant="ghost" title="确认"></UButton>
    <UButton @click="emits('cancel'); edit = false;" icon="ri-close-line" variant="ghost" title="取消"></UButton>
  </div>
  <div v-else>
    <UButton @click="edit = true" :icon="props.icon" class="p-1">
      <slot></slot>
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'complete', value: string): void;
  (e: 'cancel'): void;
  (e: 'update:text', value: string): void;
}>();
const props = withDefaults(
  defineProps<{ icon?: string; placeholder?: string, text?: string; withEdit?: boolean }>(), {
  text: '',
  edit: false
})
const edit = ref(props.withEdit)
const localText = ref(props.text)

// 监听 localText 的变化并更新 modelValue
watch(localText, (newValue) => {
  emits('update:text', newValue);
});
// 监听 props.modelValue 的变化并更新 localText
watch(
  () => props.text,
  (newValue) => {
    localText.value = newValue;
  }
);

</script>

<style></style>
