function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Product Value Comparison')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
