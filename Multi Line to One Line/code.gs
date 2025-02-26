function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function convertToSingleLine(text) {
  try {
    // Try parsing as JSON
    let parsedJSON = JSON.parse(text);
    // Convert JSON to string with escaped forward slashes and Unicode encoding
    return JSON.stringify(parsedJSON).replace(/\//g, "\\/").replace(/[\u007F-\uFFFF]/g, c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
  } catch (e) {
    // If not JSON, treat it as plain text/XML
    return text.replace(/\s+/g, ' ').trim();
  }
} 

function processText(inputText) {
  return convertToSingleLine(inputText);
}

// HTML File: index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
