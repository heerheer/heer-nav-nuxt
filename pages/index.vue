<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- LOGO -->
    <div class="w-full flex justify-center items-center gap-1">
      <img class="h-12" src="https://nav.heerdev.top/assets/logo-c014dd94.png" alt="" />
      <UButton v-if="edit" icon="ri-edit-2-line" class="px-1" variant="ghost" title="编辑logo地址" />
    </div>

    <!-- SEARCH -->
    <div class="w-full flex justify-center items-center flex-col">
      <div class="w-full sm:w-2/3 md:w-[500px] flex gap-2 items-center">
        <SearchBar :engines="search_engines" />
        <ColorModeButton />
        <!-- 编辑模式下增加按钮 -->
        <UButton v-if="edit" icon="ri-sticky-note-add-line" variant="ghost" @click="addNewSite()" title="添加站点" />
      </div>
    </div>

    <!-- SITES -->

    <div class="w-full flex justify-center items-start flex-col">
      <div v-if="existSites" v-for="category in siteStore.categoryies" :key="category" class="w-full mb-2">
        <div class="text-base font-bold mb-2">
          {{ category }}
          <!-- 编辑模式下可以通过分类快速编辑多个网站 -->
          <UButton v-if="edit" icon="ri-edit-2-line" class="px-1" variant="ghost" />
        </div>
        <div class="grid grid-flow-row grid-cols-1 gap-4 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <SiteBlock v-for="site in siteStore.getSiteByCategory(category)" :site="site" @edit-site="editSite"
            @delete-site="deleteSite" />
        </div>
      </div>

      <div class="w-full justify-center items-center flex h-fit py-12 flex-col gap-4" v-if="!existSites">
        <img :src="empyt_svg" alt="SVG Image" width="30%" />
        <div class="text-center text-gray-500 text-2xl">
          这儿似乎没有东西...
        </div>
      </div>
    </div>
  </div>

  <SiteConfigModal v-model="isOpen" :current="current" @completeEdit="completeEdit">

  </SiteConfigModal>

</template>

<script setup lang="ts">
import { darkMode } from "#tailwind-config";
import type { SearchEngine, Site } from "~/shared.types";

import empyt_svg from "assets/illustrations/undraw_empty_re_opql.svg";

//const sites = ref([] as Site[])
// sitesmap 根据 site的分类来转为 分类索引的dict
// const sitesMap = computed(() => {
//   const map: { [key: string]: Site[] } = {};
//   for (const site of sites.value) {
//     if (!map[site.category]) {
//       map[site.category] = [];
//     }
//     map[site.category].push(site);
//   }
//   return map;
// });

const store = useModeStore();
const siteStore = useSiteStore();

const toast = useToast()

const { edit } = storeToRefs(store);

// modal相关
const isOpen = ref(false);
const current = ref({} as Site);

const currentEncrypt = ref({} as { url: string; key: string });

onMounted(() => {
  // 初始化site
  siteStore.refresh();
});


const search_engines: SearchEngine[] = [
  {
    name: "Heer Nav 站内搜索",
    label: "站内搜索",
    on_search: async (text) => {
      // 使用/edit [token]来进入编辑模式
      if (text.startsWith("edit:")) {
        let token = text.split("edit:")[1].trim();
        let auth = await $fetch(`/api/auth`, {
          params: {
            token,
          },
        });

        if (auth.code == 200) {
          store.setEditMode(true, token);
          toast.add({
            title: "编辑模式已开启",
            description: "您可以在编辑模式下进行编辑",
            color: "green",
          });

        }
      }
    },
    avatar: {
      url: "https://nav.heerdev.top/favicon.png",
    },
  },
  {
    name: "在DuckDuckGo上搜索",
    label: "DuckDuckGo",
    on_search: (text) => {
      window.location.href = "https://duckduckgo.com/?q=" + text;
    },
    avatar: {
      url: "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTg0IDE0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsPSIjZGU1ODMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05MS45NDYgMTA3LjEyMmMyOS41ODEgMCA1My41NjEtMjMuOTggNTMuNTYxLTUzLjU2MVMxMjEuNTI3IDAgOTEuOTQ3IDBDNjIuMzY0IDAgMzguMzg0IDIzLjk4IDM4LjM4NCA1My41NjFzMjMuOTggNTMuNTYxIDUzLjU2MSA1My41NjF6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8cGF0aCBmaWxsPSIjZGRkIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05OS40NzggOTMuNTIyYzAtLjQxOC4xMDMtLjUxMy0xLjIyNy0zLjE2NS0zLjUzNS03LjA3OS03LjA4OC0xNy4wNTktNS40NzItMjMuNDk1LjI5NC0xLjE3LTMuMzMtNDMuMzA0LTUuODkyLTQ0LjY2MS0yLjg0OC0xLjUxOC02LjM1MS0zLjkyNS05LjU1Ni00LjQ2LTEuNjI2LS4yNi0zLjc1OC0uMTM4LTUuNDI1LjA4Ny0uMjk2LjA0LS4zMDguNTcyLS4wMjUuNjY4IDEuMDk0LjM3IDIuNDIzIDEuMDE0IDMuMjA2IDEuOTg4LjE0OC4xODQtLjA1MS40NzQtLjI4Ny40ODItLjczOC4wMjgtMi4wNzcuMzM3LTMuODQ0IDEuODM4LS4yMDQuMTczLS4wMzUuNDk1LjIyOC40NDMgMy43OTctLjc1IDcuNjc0LS4zOCA5Ljk2IDEuNjk2LjE0OC4xMzUuMDcuMzc3LS4xMjMuNDNDNjEuMTkgMzAuNzYgNjUuMTE3IDQ4LjAxIDcwLjM5NiA2OS4xNzdjNC42NTQgMTguNjY2IDYuNDM1IDI0LjgxIDcuMDEyIDI2LjcyN2EuNzIuNzIgMCAwIDAgLjQyNC40NjljNi44NSAyLjY5NyAyMS42NDYgMi44MDUgMjEuNjQ2LTEuODA1eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEwMi4xOTggOTcuNDk4Yy0yLjQwNi45NDEtNy4xMTQgMS4zNi05LjgzMyAxLjM2LTMuOTg4IDAtOS43My0uNjI4LTExLjgyMS0xLjU3LTEuMjkzLTMuOTc2LTUuMTYtMTYuMzAzLTguOTc4LTMxLjk1NmwtLjM3NC0xLjUzLS4wMDMtLjAxMmMtNC41NC0xOC41NDItOC4yNDgtMzMuNjg3IDEyLjA3NC0zOC40NDUuMTg1LS4wNDMuMjc2LS4yNjUuMTUzLS40MTEtMi4zMzEtMi43NjYtNi43LTMuNjczLTEyLjIyMi0xLjc2OC0uMjI3LjA3OS0uNDI0LS4xNS0uMjgzLS4zNDQgMS4wODMtMS40OTMgMy4yLTIuNjQgNC4yNDQtMy4xNDMuMjE2LS4xMDQuMjAzLS40Mi0uMDI1LS40OTJhMjMuMjk5IDIzLjI5OSAwIDAgMC0zLjE1Ni0uNzUzYy0uMzEtLjA1LS4zMzgtLjU4LS4wMjctLjYyMiA3LjgzLTEuMDU0IDE2LjAwNiAxLjI5NyAyMC4xMDkgNi40NjVhLjI3Mi4yNzIgMCAwIDAgLjE1NS4wOTZjMTUuMDI0IDMuMjI2IDE2LjEgMjYuOTc3IDE0LjM2OSAyOC4wNTktLjM0MS4yMTMtMS40MzQuMDktMi44NzctLjA3LTUuODQ2LS42NTUtMTcuNDIyLTEuOTUtNy44NjggMTUuODU2LjA5NC4xNzYtLjAzLjQwOS0uMjI4LjQ0LTUuMzg4LjgzNyAxLjUxNyAxNy43MiA2LjU5MSAyOC44NHoiLz4KICA8cGF0aCBmaWxsPSIjM2NhODJiIiBkPSJNMTA4LjkxOSA3NS45MDRjLTEuMTQ0LS41My01LjU0MiAyLjYyNC04LjQ2MSA1LjA0NS0uNjEtLjg2My0xLjc2LTEuNDktNC4zNTUtMS4wNC0yLjI3LjM5Ni0zLjUyNC45NDMtNC4wODQgMS44ODctMy41ODQtMS4zNTktOS42MTQtMy40NTYtMTEuMDctMS40My0xLjU5MyAyLjIxNC4zOTcgMTIuNjg3IDIuNTEyIDE0LjA0NyAxLjEwNC43MSA2LjM4Ni0yLjY4NSA5LjE0NC01LjAyNi40NDUuNjI3IDEuMTYyLjk4NiAyLjYzNC45NTIgMi4yMjgtLjA1MiA1Ljg0MS0uNTcgNi40MDEtMS42MDguMDM0LS4wNjMuMDY0LS4xMzcuMDg5LS4yMjIgMi44MzUgMS4wNiA3LjgyNCAyLjE4IDguOTM5IDIuMDE0IDIuOTA1LS40MzctLjQwNS0xMy45OTYtMS43NDktMTQuNjE5eiIvPgogIDxwYXRoIGZpbGw9IiM0Y2JhM2MiIGQ9Ik0xMDAuNzI1IDgxLjI2Yy4xMjEuMjE0LjIxNy40NC4zLjY3LjQwNCAxLjEzIDEuMDYyIDQuNzI2LjU2NCA1LjYxNC0uNDk4Ljg4OC0zLjczMiAxLjMxNy01LjcyNyAxLjM1MXMtMi40NDQtLjY5NS0yLjg0OC0xLjgyNWMtLjMyNC0uOTA0LS40ODMtMy4wMy0uNDc5LTQuMjQ3LS4wODItMS44MDYuNTc4LTIuNDQgMy42MjctMi45MzQgMi4yNTctLjM2NSAzLjQ1LjA2IDQuMTM4Ljc4NiAzLjIwNC0yLjM5IDguNTQ5LTUuNzY1IDkuMDctNS4xNDggMi42IDMuMDc1IDIuOTI4IDEwLjM5NCAyLjM2NSAxMy4zNC0uMTg0Ljk2Mi04Ljc5MS0uOTU1LTguNzkxLTEuOTkzIDAtNC4zMTEtMS4xMTktNS40OTQtMi4yMTktNS42MTV6TTgxLjg3IDc5LjkxM2MuNzA2LTEuMTE2IDYuNDIyLjI3MiA5LjU2IDEuNjY4IDAgMC0uNjQ0IDIuOTIyLjM4MiA2LjM2NC4zIDEuMDA3LTcuMjIgNS40ODgtOC4yMDEgNC43MTctMS4xMzQtLjg5MS0zLjIyMi0xMC40MDQtMS43NC0xMi43NXoiLz4KICA8cGF0aCBmaWxsPSIjZmMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04NC42NCA1Ny4yNDljLjQ2Mi0yLjAxMiAyLjYxNy01LjgwMiAxMC4zMS01LjcxIDMuODktLjAxNiA4LjcyMi0uMDAxIDExLjkyNi0uMzY1YTQyLjg4NSA0Mi44ODUgMCAwIDAgMTAuNjUtMi41OWMzLjMzMS0xLjI3IDQuNTEzLS45ODggNC45MjctLjIyNy40NTYuODM1LS4wODEgMi4yNzgtMS4yNDUgMy42MDYtMi4yMjMgMi41MzYtNi4yMTkgNC41MDItMTMuMjc3IDUuMDg1LTcuMDU4LjU4My0xMS43MzQtMS4zMS0xMy43NDYgMS43NzItLjg2OCAxLjMzLS4xOTcgNC40NjMgNi42MjggNS40NSA5LjIyMyAxLjMzIDE2Ljc5OC0xLjYwNCAxNy43MzQuMTY4cy00LjQ1NSA1LjM4LTEzLjY5MyA1LjQ1NWMtOS4yMzkuMDc2LTE1LjAwOS0zLjIzNC0xNy4wNTUtNC44OC0yLjU5Ny0yLjA4Ny0zLjc1OC01LjEzMi0zLjE2LTcuNzY0eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPGcgZmlsbD0iIzE0MzA3ZSIgb3BhY2l0eT0iLjgiPgogICAgPHBhdGggZD0iTTk2LjQwNCAzNS4yNTZjLjUxNi0uODQ0IDEuNjU4LTEuNDk1IDMuNTI4LTEuNDk1czIuNzUuNzQ0IDMuMzU5IDEuNTc0Yy4xMjQuMTY4LS4wNjQuMzY3LS4yNTYuMjg0bC0uMTQtLjA2MWMtLjY4NC0uMjk5LTEuNTI0LS42NjYtMi45NjMtLjY4Ni0xLjUzOC0uMDIyLTIuNTA4LjM2My0zLjEyLjY5Ni0uMjA1LjExMS0uNTMtLjExMi0uNDA4LS4zMTJ6bS0yMS4wNTMgMS4wNzljMS44MTYtLjc1OSAzLjI0My0uNjYgNC4yNTItLjQyMi4yMTMuMDUuMzYtLjE3OC4xOS0uMzE1LS43ODMtLjYzMi0yLjUzNS0xLjQxNi00LjgyMS0uNTY0LTIuMDM5Ljc2LTMgMi4zNC0zLjAwNiAzLjM3OS0uMDAxLjI0NS41MDMuMjY2LjYzMy4wNTguMzUyLS41Ni45MzctMS4zNzcgMi43NTItMi4xMzZ6Ii8+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMDEuNTIxIDQ2Ljc5OWMtMS42MDYgMC0yLjkwOC0xLjI5OS0yLjkwOC0yLjg5N3MxLjMwMi0yLjg5NyAyLjkwOC0yLjg5N2MxLjYwNSAwIDIuOTA3IDEuMjk5IDIuOTA3IDIuODk3cy0xLjMwMiAyLjg5Ny0yLjkwNyAyLjg5N3ptMi4wNDctMy44NTZhLjc1Mi43NTIgMCAwIDAtMS41MDUgMCAuNzUyLjc1MiAwIDAgMCAxLjUwNSAwem0tMjEuMzEgMi45NjRhMy4zODMgMy4zODMgMCAwIDEtMy4zODkgMy4zNzhjLTEuODcgMC0zLjM4OS0xLjUxMi0zLjM4OS0zLjM3OHMxLjUyLTMuMzc4IDMuMzg5LTMuMzc4YTMuMzg1IDMuMzg1IDAgMCAxIDMuMzg5IDMuMzc4em0tLjk5OS0xLjEyYS44NzguODc4IDAgMCAwLTEuNzU1IDAgLjg3Ni44NzYgMCAwIDAgMS43NTUgMHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogIDwvZz4KICA8cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05MS45NDYgOTguNTQ0YzI0Ljg0MyAwIDQ0Ljk4My0yMC4xNCA0NC45ODMtNDQuOTgzIDAtMjQuODQzLTIwLjE0LTQ0Ljk4My00NC45ODMtNDQuOTgzLTI0Ljg0MyAwLTQ0Ljk4MyAyMC4xNC00NC45ODMgNDQuOTgzIDAgMjQuODQzIDIwLjE0IDQ0Ljk4MyA0NC45ODMgNDQuOTgzem0wIDQuMTg0YzI3LjE1NCAwIDQ5LjE2Ny0yMi4wMTMgNDkuMTY3LTQ5LjE2N1MxMTkuMSA0LjM5NCA5MS45NDYgNC4zOTQgNDIuNzggMjYuNDA3IDQyLjc4IDUzLjU2czIyLjAxMyA0OS4xNjcgNDkuMTY3IDQ5LjE2N3oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik02OS45NDIgMTI5LjI2SDY2LjQ2bC02LjMzOCA2LjUxN3YtMTMuMDMzaC0yLjY3OHYyMi4yMjhoMi42Nzh2LTcuMzJsNy4yMyA3LjIzLjA5LjA5aDMuMjE0di0uMjY4bC04LjEyNC04LjAzNHptLTE3LjE0IDExLjg3M2MtLjk4Mi45ODItMi40MSAxLjUxOC00LjAxNyAxLjUxOC0yLjc2NyAwLTUuNTM0LTEuNjk2LTUuNTM0LTUuNjI0IDAtMy4zMDMgMi4zMi01LjYyNCA1LjUzNC01LjYyNCAxLjQyOCAwIDIuNzY3LjUzNiAzLjgzOSAxLjUxOGwuMDg5LjA4OSAxLjY5Ni0xLjc4Ni0uMDktLjA4OWMtMS42MDYtMS41MTctMy40OC0yLjIzMi01LjYyMy0yLjIzMi00LjkxIDAtOC4yMTMgMy4zMDMtOC4yMTMgOC4xMjQgMCA1LjYyNCA0LjEwNiA4LjEyMyA4LjIxMyA4LjEyM2guMDljMi4xNDEgMCA0LjE5NS0uODAzIDUuNjIzLTIuMzIxbC4wOS0uMDg5LTEuNzg2LTEuNzg1em0tMTguMTIyLTMuNDgxYzAgMi44NTYtMS45NjMgNC45OTktNC43MyA1LjA4OC0yLjk0NiAwLTQuNzMyLTEuNzg1LTQuNzMyLTQuODJ2LTguNjZIMjIuNTR2OC42NmMwIDQuNDYzIDIuNjc4IDcuMzIgNi44NzQgNy4zMmguMDljMi4wNTIgMCAzLjkyNy0uOTgyIDUuMTc3LTIuNWwuMDg5LS4xNzkuMDkgMi40MTFoMi40OTlWMTI5LjI2SDM0LjY4ek04LjM0NyAxMjIuNjU1SC4yMjN2MjIuMzE3aDguMTI0YzcuNzY2IDAgMTEuMTU4LTUuNzEzIDExLjE1OC0xMS4zMzcgMC01LjI2Ny0zLjQ4MS0xMC45OC0xMS4xNTgtMTAuOTh6bTguMzkgMTAuODljMCA0LjI4NS0yLjU4OCA4LjU3LTguMzAxIDguNTdIMy4wOHYtMTYuNjkzaDUuMjY3YzUuNzEzIDAgOC4zOSA0LjE5NiA4LjM5IDguMTIzem0xMzguMjc3IDEuNjk3aDYuODc0djUuMTc3Yy0xLjY5NiAxLjQyOC0zLjc0OSAyLjIzMi01Ljk4MSAyLjIzMi02LjA3IDAtOC44MzgtNC4zNzQtOC44MzgtOC42NTkgMC00LjM3NCAyLjc2OC05LjEwNiA4Ljc0OS05LjEwNiAyLjQxIDAgNC42NDIuODkzIDYuNDI3IDIuNWwuMDg5LjA4OSAxLjYwNy0xLjg3NC0uMDg5LS4wOWMtMi4xNDMtMi4xNDItNC45OTktMy4yMTMtOC4xMjQtMy4yMTMtMy4zOTIgMC02LjI0OCAxLjA3MS04LjMwMiAzLjIxMy0yLjE0MiAyLjE0My0zLjMwMiA1LjE3OC0zLjIxMyA4LjU3IDAgNS4yNjcgMy4wMzUgMTEuMzM3IDExLjYwNSAxMS4zMzdoLjE3OGMzLjIxNCAwIDYuMjQ5LTEuMzM5IDguMzkxLTMuNzQ5di04LjgzOGgtOS40NjJ2Mi40MTF6bS03My43MzUtMTIuNTg3aC04LjEyNHYyMi4zMTdoOC4xMjRjNy43NjYgMCAxMS4xNTgtNS43MTMgMTEuMTU4LTExLjMzNyAwLTUuMjY3LTMuNDgxLTEwLjk4LTExLjE1OC0xMC45OHptOC4zOSAxMC44OWMwIDQuMjg1LTIuNTg4IDguNTctOC4zMDEgOC41N2gtNS4yNjd2LTE2LjY5M2g1LjI2N2M1LjYyNCAwIDguMzAyIDQuMTk2IDguMzAyIDguMTIzem04NS42MDktNC42NDJjLTQuNzMxIDAtOC4xMjMgMy40ODItOC4xMjMgOC4yMTNzMy4zOTIgOC4xMjQgOC4xMjMgOC4xMjQgOC4yMTMtMy4zOTMgOC4yMTMtOC4xMjRjMC00LjgyLTMuMzkyLTguMjEzLTguMjEzLTguMjEzem01LjUzNSA4LjIxM2MwIDMuMzAzLTIuMzIxIDUuNjI0LTUuNTM1IDUuNjI0LTMuMTI0IDAtNS40NDUtMi4zMjEtNS40NDUtNS42MjQgMC0zLjM5MiAyLjIzMi01LjgwMiA1LjUzNC01LjgwMiAzLjEyNS4wODkgNS40NDYgMi40OTkgNS40NDYgNS44MDJ6bS03My4yLjUzNmMwIDIuODU2LTEuOTY0IDQuOTk5LTQuNzMxIDUuMDg4LTIuOTQ2IDAtNC43MzEtMS43ODUtNC43MzEtNC44MnYtOC42NmgtMi42Nzl2OC42NmMwIDQuNDYzIDIuNjc5IDcuMzIgNi43ODUgNy4zMmguMDg5YzIuMDUzIDAgMy45MjgtLjk4MiA1LjE3OC0yLjVsLjA4OS0uMTc5LjA4OSAyLjQxMWgyLjVWMTI5LjI2aC0yLjY3OHY4LjM5MnptMTguMTIxIDMuNDgxYy0uOTgyLjk4Mi0yLjQxIDEuNTE4LTQuMDE3IDEuNTE4LTIuNzY3IDAtNS41MzQtMS42OTYtNS41MzQtNS42MjQgMC0zLjMwMyAyLjMyMS01LjYyNCA1LjUzNC01LjYyNCAxLjQyOSAwIDIuNzY4LjUzNiAzLjgzOSAxLjUxOGwuMDg5LjA4OSAxLjY5Ni0xLjc4Ni0uMDg5LS4wODljLTEuNjA3LTEuNTE3LTMuNDgyLTIuMjMyLTUuNjI0LTIuMjMyLTQuOTEgMC04LjIxMyAzLjMwMy04LjIxMyA4LjEyNCAwIDUuNjI0IDQuMTA3IDguMTIzIDguMjEzIDguMTIzaC4wODljMi4xNDMgMCA0LjE5Ni0uODAzIDUuNjI0LTIuMzIxbC4wODktLjA4OS0xLjc4NS0xLjc4NXptMTcuMTQtMTEuODczaC0zLjQ4MmwtNi4zMzggNi41MTd2LTEzLjAzM2gtMi42Nzh2MjIuMjI4aDIuNjc4di03LjMybDcuMjMxIDcuMjMuMDg5LjA5aDMuMjE0di0uMjY4bC04LjEyMy04LjAzNHoiLz4KPC9zdmc+Cg==",
    },
  },
  {
    name: "向devv_提问",
    label: "devv.ai",
    on_search: (text) => {
      window.location.href = `https://devv.ai/zh/search/${text}?lang=zh&_rsc=b831j`;
    },
    avatar: {
      icon: "devv",
    },
  },
];

const existSites = computed(() => {
  return Object.keys(siteStore.sites).length > 0;
});

const addNewSite = async () => {
  let site: Site = {
    name: "",
    desc: "",
    url: "",
    type: "common",
    category: "",
    tags: [],
    encrypted: undefined,
  };

  // 重置加密区
  currentEncrypt.value = { url: "", key: "" };

  current.value = site;
  isOpen.value = true;
};

const editSite = async (site: Site) => {
  // 重置加密区
  currentEncrypt.value = { url: "", key: "" };

  current.value = JSON.parse(JSON.stringify(site));
  isOpen.value = true;
};

const deleteSite = async (site: Site) => {
  let resp = await $fetch("/api/sites", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: store.token,
    },
    body: JSON.stringify(site),
  });
};

import crypto from "crypto-js";
import SiteConfigModal from "~/components/Modals/SiteConfigModal.vue";
import sitesDelete from "~/server/api/sites.delete";

const completeEdit = async () => {
  if (
    !current.value.name ||
    !current.value.url ||
    !current.value.desc ||
    !current.value.category ||
    !current.value.tags
  ) {
    alert("请填写所有必填项！");
    return;
  }

  if (
    current.value.encrypted != undefined &&
    currentEncrypt.value.url &&
    currentEncrypt.value.key
  ) {
    // 代表需要进行加密结果运算
    current.value.encrypted = {
      url: crypto.AES.encrypt(
        current.value.url,
        currentEncrypt.value.key
      ).toString(),
    };
  }

  let resp = await $fetch("/api/sites", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: store.token,
    },
    body: JSON.stringify(current.value),
  });
  console.log(JSON.stringify(resp));
  if (resp.code == 200) {
    alert("修改成功");
    await siteStore.refresh();
    isOpen.value = false;
  } else {
    alert("修改失败：" + resp.message);
  }
};


</script>

<style>
.hide-on-hover-and-focus:focus+div #search-icon {
  display: none;
}

.hide-on-hover-and-focus:focus+div #enter-search {
  display: block;
}

.devv {
  background-color: black;
  mask-image: url('data:image/svg+xml,<svg width="46" height="46" fill="white"  xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.2345 5.4479C18.7396 5.34403 19.2605 5.34403 19.7655 5.4479C20.3493 5.56796 20.8711 5.86021 21.2859 6.09256L21.2859 6.09257L21.399 6.15574L35.4585 13.9666C35.4742 13.9753 35.4902 13.9842 35.5063 13.9931C35.5295 14.0059 35.553 14.0188 35.5769 14.032L35.5784 14.0328C36.0176 14.2747 36.5697 14.5788 36.9937 15.0389C37.3603 15.4367 37.6378 15.9082 37.8075 16.4219C38.0038 17.016 38.0015 17.6464 37.9996 18.1477C37.9995 18.1946 37.9993 18.2403 37.9993 18.2847V33.7067C37.9993 33.7256 37.9993 33.7448 37.9994 33.7642C37.9994 33.7903 37.9995 33.8168 37.9996 33.8437C38.0015 34.3451 38.0038 34.9754 37.8075 35.5695C37.6378 36.0832 37.3603 36.5547 36.9937 36.9525C36.5697 37.4126 36.0176 37.7167 35.5784 37.9586L35.5107 37.9959L35.4585 38.0249L21.399 45.8357L21.2859 45.8988C20.8711 46.1312 20.3493 46.4235 19.7655 46.5435C19.2605 46.6474 18.7396 46.6474 18.2345 46.5435C17.6507 46.4235 17.1289 46.1312 16.7141 45.8988L16.601 45.8357L2.54153 38.0249C2.50298 38.0034 2.46327 37.9816 2.42259 37.9592L2.42157 37.9586C1.98244 37.7167 1.43029 37.4126 1.00627 36.9525C0.639677 36.5547 0.362247 36.0832 0.192536 35.5695C-0.00375985 34.9754 -0.00146325 34.3451 0.000363158 33.8437C0.00053389 33.7969 0.000700421 33.7511 0.000700421 33.7067V18.2847C0.000700421 18.2403 0.00053389 18.1946 0.000363158 18.1477C-0.00146325 17.6464 -0.00375986 17.016 0.192535 16.4219C0.362246 15.9082 0.639675 15.4368 1.00627 15.0389C1.43029 14.5788 1.98243 14.2747 2.42157 14.0328C2.46261 14.0102 2.50266 13.9882 2.54153 13.9666L16.601 6.15574L16.7141 6.09258C17.1289 5.86023 17.6507 5.56797 18.2345 5.4479ZM18.9909 9.18376C18.8813 9.23664 18.7343 9.31746 18.4464 9.47742L5.81285 16.4961L18.9999 23.8222L32.1871 16.496L19.5536 9.47742C19.2657 9.31746 19.1187 9.23664 19.0091 9.18376L19 9.17941L18.9909 9.18376ZM17.1 27.1136L3.80056 19.725V33.7067C3.80056 34.0543 3.80135 34.2323 3.80911 34.3611L3.8098 34.372L3.81899 34.3779C3.92785 34.4472 4.08301 34.5343 4.38691 34.7032L17.1001 41.766L17.1 27.1136ZM23.3465 37.3705C22.6028 37.7808 22.3326 38.7162 22.7428 39.4598C23.1531 40.2035 24.0885 40.4737 24.8321 40.0635L33.2205 35.4358C33.9641 35.0255 34.2344 34.0901 33.8241 33.3465C33.4139 32.6028 32.4785 32.3326 31.7348 32.7428L23.3465 37.3705Z" ></path></svg>');
  mask-size: cover;
}
</style>
