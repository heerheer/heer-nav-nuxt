import { defineStore } from 'pinia'


export const useModeStore = defineStore('mode', () => {
    const edit = ref(false)
    const token = ref('')
    const setEditMode = (vlaue: boolean, t: string = '') => { edit.value = vlaue; token.value = t };
    return { edit, setEditMode,token }
})