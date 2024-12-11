 function onOpen() {
    SpreadsheetApp
    .getUi()
    .createMenu("Scripts")
    .addItem("Scrape URLs in column A", "scrapeHTMLFromURLs")
    .addItem('Run AI Model', 'handleAIprompt')
    .addToUi()
  }