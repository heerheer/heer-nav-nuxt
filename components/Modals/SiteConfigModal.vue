<template>
    <UModal v-bind:model-value="modelValue" prevent-close>
        <div class="p-4 flex flex-col gap-2">
            <div class="flex justify-between">
                <div>编辑站点信息</div>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isOpen = false" title="取消" />
            </div>
            <UDivider />

            <UTabs :items="tabs">
                <template #item="{ item }">
                    <div v-if="item.key === 'ess'" class="flex flex-col gap-2">
                        <UFormGroup label="网站名称">
                            <UInput placeholder="请输入网站名称" v-model="current.name" />
                        </UFormGroup>
                        <UFormGroup label="网站地址" description="若选择了 高级>加密 则地址失效">
                            <UInput placeholder="https://www.example.com" v-model="current.url" />
                        </UFormGroup>
                        <UFormGroup label="站点描述" error>
                            <UTextarea placeholder="一个神奇的网站..." v-model="current.desc" />
                        </UFormGroup>
                        <UFormGroup label="站点分类" error description="选择一个已有分类或者创建新的">
                            <div class="flex gap-2 items-center">
                                <UInputMenu size="xs" v-model="current.category" :options="siteStore.categoryies" />
                                <InputButton icon="ri-add-line" placeholder="例如...二次元" @complete="addCategory">
                                </InputButton>
                            </div>
                        </UFormGroup>

                        <UFormGroup label="站点标签" error description="选择一个已有标签或者创建新的">
                            <div class="flex gap-2 items-center">
                                <UBadge size="xs" variant="subtle" v-for="tag in current.tags" :key="tag" :label="tag"
                                    class="pr-0">
                                    {{ tag }}
                                    <UButton size="xs" variant="ghost" icon="ri-close-line" class="p-1"
                                        @click="current.tags.splice(current.tags.indexOf(tag), 1)"
                                        :title="`删除标签:${tag}`"></UButton>
                                </UBadge>

                                <InputButton icon="ri-add-line" placeholder="Example" @complete="(text) => {
                                    if (!current.tags.includes(text)) current.tags.push(text);
                                }
                                    "></InputButton>
                            </div>
                        </UFormGroup>
                    </div>
                    <div v-else-if="item.key === 'advance'">
                        <UFormGroup label="加密模块" error description="使得网站需要密码才可以解密后跳转(加密前信息不会上传云端)"
                            class="flex flex-col gap-2" hint="可选,使得基础信息网站内容失效">
                            <UButton v-if="!current.encrypted" @click="current.encrypted = { url: '' }"
                                icon="ri-door-lock-box-line">
                                启用加密</UButton>
                            <div v-else class="flex flex-col gap-2">
                                <!-- <UFormGroup label="目标地址">
                                    <UInput placeholder="https://example.com/encrypt" v-model="currentEncrypt.url" />
                                </UFormGroup>
                                <UFormGroup label="约定密钥">
                                    <UInput placeholder="this_is_the_aes_key" v-model="currentEncrypt.key" />
                                </UFormGroup> -->
                                <UFormGroup label="提示信息" hint="可选">
                                    <UInput placeholder="加密后显示的提示信息" v-model="current.encrypted.tip" />
                                </UFormGroup>
                            </div>
                        </UFormGroup>
                    </div>
                </template>
            </UTabs>

            <UDivider />

            <!-- footer -->
            <div class="flex justify-end">
                <UButton icon="ri-check-line" @click="emit('completeEdit', current)">修改完成</UButton>
            </div>
        </div>
    </UModal>
</template>

<script setup lang="ts">
import type { Site } from '~/shared.types';

const siteStore = useSiteStore();

// 计算属性，根据 category 对 sites 进行分组
const getCategories = () => {
    return siteStore.getAllSites().reduce((list: string[], site: Site) => {
        console.log(site.category);
        if (!list.includes(site.category)) {
            list.push(site.category);
        }
        return list;
    }, []);
};

const props = defineProps<{
    modelValue: boolean;
    current: Site;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'completeEdit', value: Site): void;
}>();

const isOpen = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const tabs = [
    {
        key: "ess",
        label: "基础信息",
    },
    {
        key: "advance",
        label: "高级设置",
    },
];

const addCategory = async (category: string) => {
    props.current.category = category;
};

</script>