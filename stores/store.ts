import { defineStore } from "pinia";
import type { Site } from "~/shared.types";

export const useModeStore = defineStore("mode", () => {
  const edit = ref(false);
  const token = ref("");
  const setEditMode = (vlaue: boolean, t: string = "") => {
    edit.value = vlaue;
    token.value = t;
  };
  return { edit, setEditMode, token };
});

export const useSiteStore = defineStore("site", () => {
  // 使用 ref 定义一个数组来存储 Site 对象
  const { data, refresh } = useFetch("/api/sites");
  const sites = data as Ref<Site[]>;

  const categoryies = computed(() => {
    return sites.value.reduce((list: string[], site: Site) => {
      console.log(site.category);
      if (!list.includes(site.category)) {
        list.push(site.category);
      }
      return list;
    }, []);
  });
  // 添加 Site 的方法
  const addSite = (site: Site) => {
    sites.value.push(site);
  };

  // 删除 Site 的方法
  const removeSite = (siteName: string) => {
    sites.value = sites.value.filter((site) => site.name !== siteName);
  };

  // 更新 Site 的方法
  const updateSite = (siteName: string, updatedSite: Partial<Site>) => {
    const index = sites.value.findIndex((site) => site.name === siteName);
    if (index !== -1) {
      sites.value[index] = { ...sites.value[index], ...updatedSite };
    }
  };

  // 获取所有 Site 的方法
  const getAllSites = () => {
    return sites.value;
  };

  // 获取单个 Site 的方法
  const getSiteByName = (siteName: string) => {
    return sites.value.find((site) => site.name === siteName);
  };

  const getSiteByCategory = (category: string) => {
    return sites.value.filter((site) => site.category === category);
  };

  const getMap = () => {
    let map = new Map<string, Site[]>();
    for (const site of sites.value) {
      if (!map.has(site.category)) map.set(site.category, []);
      map.get(site.category)!.push(site);
    }
    return map;
  };

  return {
    sites,
    categoryies,
    addSite,
    removeSite,
    updateSite,
    getAllSites,
    getSiteByName,
    getMap,
    getSiteByCategory,
    refresh,
  };
});
