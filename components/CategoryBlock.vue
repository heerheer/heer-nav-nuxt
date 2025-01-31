<template>
    <div class="text-base font-bold mb-2">
        <div v-if="!inEdit">
            {{ category }}
            <UButton v-if="edit" icon="ri-edit-2-line" class="px-1" variant="ghost" @click="inEdit = true" />
        </div>
        <InputButton v-if="edit && inEdit" :text="category" :with-edit="true" icon="ri-add-line" placeholder="例如...音乐"
            @complete="onCategoryComplete" @cancel="inEdit = false">
        </InputButton>
    </div>
</template>
<script setup lang="ts">

const props = defineProps<{ category: string }>();

const modeStore = useModeStore();
const siteStore = useSiteStore();
const { edit } = storeToRefs(modeStore);

const inEdit = ref<boolean>(false);

const onCategoryComplete = async (value: string) => {
    if (!confirm('修改分类为?' + value)) {
        inEdit.value = false;
        return;
    }
    await $fetch("/api/category/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: modeStore.token,
        },
        body: {
            old: props.category,
            newValue: value
        },
    });
    inEdit.value = false;
    await siteStore.refresh()
};

</script>