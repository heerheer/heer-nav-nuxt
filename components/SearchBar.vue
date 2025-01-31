<template>
  <div class="rounded-lg w-full h-full px-2 py-2 shadow-md 
    bg-white
    outline-indigo-400
    dark:outline  
    flex justify-center items-center" :class="{ 'outline-none': search !== '' }">
    <UDropdown class="h-full" :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton class="shadow-md rounded-lg flex justify-center items-center
         text-white 
         dark:text-white
         text-sm font-bold" :trailing-icon="search === '' ? 'i-heroicons-chevron-down-20-solid' : ''">
        <div class="flex justify-center items-center gap-1">
          <div>
            {{ current_engine.label }}
          </div>
        </div>
      </UButton>
    </UDropdown>

    <div class="flex-1">
      <UInput name="search" v-model="search" color="primary" variant="none" placeholder="Search..."
        :ui="{ icon: { trailing: { pointer: '' } } }" @keydown.enter="handleEnter">
        <template #trailing>
          <UButton v-show="search !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
            @click="search = ''" />
        </template>
      </UInput>
    </div>
    <div>
      <div v-show="search !== ''" id="enter-search"
        class="p-1.5 rounded border-2 border-gray-400 text-gray-400 text-xs text-center cursor-pointer"
        @click="handleEnter">
        <div class="flex flex-row items-center gap-1.5">
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve">
            <path fill="#666"
              d="M137 407 l-128 -128 q-9 -10 -9 -23 q0 -13 9 -23 l128 -127 q10 -9 23 -9 q13 0 23 9 q9 10 9 23 q0 13 -9 23 l-74 72 l323 0 q15 -1 16 -16 l0 -176 q0 -14 9 -23 q9 -9 23 -9 q14 0 23 9 q9 9 9 23 l0 176 q-1 34 -23 57 q-23 22 -57 23 l-323 0 l74 73 q9 10 9 22 q0 12 -9 23 q-10 10 -23 10 q-13 0 -23 -9 l0 0 Z" />
          </svg>
          <div>ENTER</div>
          <!-- <div class="hover:visible">搜索</div> -->
        </div>
      </div>
      <div v-show="search == ''" class="text-xl font-bold text-primary">
        <i class="ri-search-2-line"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchEngine } from "~/shared.types";

const props = defineProps<{
  engines: SearchEngine[];
}>();
const current_engine_name = ref("");
const search = ref("");
const current_engine = computed(() => {
  return (
    props.engines.find((x) => x.name === current_engine_name.value) ??
    props.engines[0]
  );
});
const items = computed(() => {
  return props.engines.map((x) => {
    let item = {
      label: x.name,
      click: () => {
        current_engine_name.value = x.name;
      },
    };
    if (x.avatar.url) item = { ...item, ...{ avatar: { src: x.avatar.url } } };
    else if (x.avatar.icon) item = { ...item, ...{ icon: x.avatar.icon } };
    return [item];
  });
});

const handleEnter = () => {
  if (current_engine.value.on_search) {
    current_engine.value.on_search(search.value);
  }
};
</script>
