export default defineHandlerWithAuth(async (event) => {
  const { old, newValue } = await readBody<{ old: string; newValue: string }>(
    event
  );
  //将所有category属性为category的site都改变
  await SiteModel.updateMany({ category: old }, { category: newValue });

  return { message: "OK", code: 200, data: {} };
});
