function handleAIprompt() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Enter Prompt for AI Model',
    'Please enter the prompt you want to use for processing the selected cells:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const prompt = response.getResponseText();
    if (prompt) {
      processSelectedCells(prompt);
    } else {
      ui.alert('No prompt entered. Operation canceled.');
    }
  } else {
    ui.alert('Operation canceled.');
  }
}

function processSelectedCells(prompt) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getActiveRange();
  const startRow = range.getRow();
  const startCol = range.getColumn();
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();
  
  const apiKey = "OPENROUTER_API_KEY"; // Replace with your OpenRouter API key
  const model = "meta-llama/llama-3.2-3b-instruct:free"; // Replace with the desired model

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cellContent = range.getCell(row + 1, col + 1).getValue();
      if (!cellContent) continue; // Skip empty cells
      
      try {
        const extractedInfo = callOpenRouterAPIWithPrompt(apiKey, model, cellContent, prompt);
        sheet.getRange(startRow + row, startCol + col + 1).setValue(extractedInfo); // Output to the next column
      } catch (error) {
        Logger.log(`Error processing cell [${startRow + row}, ${startCol + col}]: ${error.message}`);
        sheet.getRange(startRow + row, startCol + col + 1).setValue(`Error: ${error.message}`);
      }
    }
  }

  SpreadsheetApp.getUi().alert('Processing completed.');
}

function callOpenRouterAPIWithPrompt(apiKey, model, text, prompt) {
  const url = `https://openrouter.ai/api/v1/chat/completions`;
  const payload = {
    model: model,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ],
    temperature: 0.7
  };
  
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response.getContentText());
  
  // Return the model's response text
  return jsonResponse.choices[0].message.content.trim();
}