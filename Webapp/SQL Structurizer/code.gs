function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SQL Structurizer');
}
