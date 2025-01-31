import { Site } from "~/shared.types";

export default defineEventHandler(async (event) => {
  const sites = await SiteModel.find({}, { _id: 0 });

  // //group sites by category and return {'':[]}
  // const categoryMap = new Map<string, Site[]>()

  // for (const site of sites) {
  //   if (categoryMap.has(site.category)) {
  //     categoryMap.get(site.category)?.push(site)
  //   } else {
  //     categoryMap.set(site.category, [site])
  //   }
  // }

  // let data: { [category: string]: Site[] } = {}
  // for (let [key, value] of categoryMap) {
  //   data[key] = value;
  // }

  return sites;
});
