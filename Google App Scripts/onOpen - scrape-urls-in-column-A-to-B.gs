  function onOpen() {
    SpreadsheetApp
    .getUi()
    .createMenu("Scrape")
    .addItem("Scrape URLs in column A", "scrapeHTMLFromURLs")
    .addToUi()
  }

  function cleanup_html(html) {
    // remove tags
    const tag_free = html
      .replace(/<style([\s\S]*?)<\/style>/gi, "")
      .replace(/<script([\s\S]*?)<\/script>/gi, "")
      .replace(/<[^>]+>/g, "");
 
    // replace html entities
    let decoded = tag_free;
    try {
      const xml = XmlService.parse('<d>' + tag_free + '</d>');
      decoded = xml.getRootElement().getText();
    } catch (e) {
      // unable to decode some HTML entity 
    }

    // remove repeated spaces
    const clean = decoded
      .replace(/\n\s*\n/gi, "\n")
      .replace(/&nbsp;/gi, " ")
      .trim();

    return clean;
  }

  function scrapeHTMLFromURLs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const urlColumn = 1; // Column A (1-indexed)
  const resultColumn = 2; // Column B (1-indexed)
  
  const lastRow = sheet.getLastRow(); // Get the last row with content
  if (lastRow < 1) {
    Logger.log("No URLs found in the sheet.");
    return;
  }
  
  // Loop through each URL in the column
  for (let i = 1; i <= lastRow; i++) {
    const url = sheet.getRange(i, urlColumn).getValue(); // Get URL from column A
    if (!url) continue; // Skip if the cell is empty
    
    try {
      const response = UrlFetchApp.fetch(url); // Fetch the HTML content
      const htmlContent = response.getContentText(); // Get the HTML as plain text
      const text = cleanup_html(htmlContent);
      sheet.getRange(i, resultColumn).setValue(text); // Write clean html to column B
    } catch (error) {
      Logger.log(`Error fetching URL at row ${i}: ${error.message}`);
      sheet.getRange(i, resultColumn).setValue(`Error: ${error.message}`);
    }
  }
  
  Logger.log("HTML scraping completed.");
}