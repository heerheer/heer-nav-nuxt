export default defineHandlerWithAuth(async (event) => {
  const { _id } = (await readBody(event)) as { _id: string };

  const resp = await SiteModel.deleteOne({ _id });

  return { message: "OK", code: 200, data: resp };
});
