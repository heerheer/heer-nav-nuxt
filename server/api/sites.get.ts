
import { Site } from "~/shared.types"

export default defineEventHandler(async (event) => {

  //从数据库取得所有的sites

  // let sites: Site[] = [
  //   {
  //     name: 'Poe',
  //     desc: '集合了多个AI能力的对话平台',
  //     url: 'https://poe.com/',
  //     type: 'common',
  //     category: 'AI Tools',
  //     tags: ['Free', 'Proxy']
  //   },
  //   {
  //     name: 'Leonardo',
  //     desc: '使用多个AI模型来生成图片与美术素材',
  //     url: 'https://app.leonardo.ai/',
  //     type: 'common',
  //     category: 'AI Tools',
  //     tags: ['Free', 'Proxy']
  //   },
  //   {
  //     name: '4EVERLAND',
  //     desc: '一个web3.0的云服务平台,提供了部署与存储等基础服务',
  //     url: 'https://www.4everland.org/',
  //     type: 'common',
  //     category: "Cloud Platform",
  //     tags: ["Free"],
  //   },
  //   {
  //     name: '赫尔偷偷色色站',
  //     desc: '基于Onedrive与SharePoint的网盘共享服务,在线观看网盘里的帅哥美女',
  //     url: '',
  //     type: 'common',
  //     category: "色色",
  //     tags: ["Private"],
  //     encrypted:{
  //       url:'U2FsdGVkX1/emaN6d0ClMA6NBpqP9gQCvmEaWX3NR7hj5N4nZOWvLCzJaYIk+cL/tXsYI6KPniuc+5YmbTwnfsz8ZrCp80idODiB0TD5V+Ifj8dfba4puj/YbA42r5WSgdUr1u1pGo8L9UwqoePW7P6y2c7hNUeWuvmFvUnXy5B8UR9nYhnnJzAECSyu8VxT'
  //     }
  //   },
  //   {
  //     name: '4Fun 寻欢',
  //     desc: '都是某个岛国的猴子...都找不到几个U熊',
  //     url: 'https://4fun.video/',
  //     type: 'common',
  //     category: "色色",
  //     tags: ["Free"],
  //   }
  // ]

  const sites = await (SiteModel.find({}, { _id: 0 }))

  //group sites by category and return {'':[]}
  const categoryMap = new Map<string, Site[]>()

  for (const site of sites) {
    if (categoryMap.has(site.category)) {
      categoryMap.get(site.category)?.push(site)
    } else {
      categoryMap.set(site.category, [site])
    }
  }

  let data: { [category: string]: Site[] } = {}
  for (let [key, value] of categoryMap) {
    data[key] = value;
  }

  return data;
})