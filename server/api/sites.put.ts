import { Site } from "~/shared.types"
import { SiteModel } from "../utils/database";
import { defineHandlerWithAuth } from "../utils/handlerWithAuth";

export default defineHandlerWithAuth(async (event) => {

    const body = await readBody(event) as Site;

    let find = await SiteModel.findOne({ name: body.name })
    if (find) {
        find.overwrite(body)
        find = await find.save()
    } else {
        console.log('new')
        const site = new SiteModel(body)
        find = await site.save()
    }

    return { message: 'OK', code: 200, data: find }

})