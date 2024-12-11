function onEdit(e) {
  // const sheetName = "Potential - To Check";
  const sheetName = "Email";
  const { range } = e;
  const sheet = range.getSheet();
  const value = range.getValue();
  if (sheet.getSheetName() != sheetName || !value.match(/^https?:\/\/.+/)) return;
  const r = range.getRichTextValue().copy().setText(value).setLinkUrl(value).build();
  range.setRichTextValue(r);
}