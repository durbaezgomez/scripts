function sendEmails() {

  // Get data from spreadsheet
  // const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TestDatabase");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EMAIL - TO SEND");

  const data = sheet.getDataRange().getValues();
  const header = data[0]; // Get the header row
  const rows = data.slice(1); // Get the rest of the rows

  // Get column indexes
  const companyNameColumn = header.indexOf("Company Name")
  const emailColumn = header.indexOf("Email")
  const contactPersonColumn = header.indexOf("Contact Person")
  const statusColumn = header.indexOf("Status")

  // Get email draft
  const draftSubject = "automation-welcome-email";
  const drafts = GmailApp.getDrafts();
  const draft = drafts.find(value => value.getMessage().getSubject() == draftSubject);
  const message = draft.getMessage();

  // Automation constants
  var sentEmailsCounter = 0;
  var unsentEmailsCounter = 0;

  // Test / Debugging - leave commented out for execution
  // const row = rows[0]
  // Logger.log(row[companyNameColumn]);
  // Logger.log(drafts[0].getMessage().getBody());


  function logAutomationResults() {
    Logger.log(`Emails sent: `+ sentEmailsCounter);
    Logger.log(`Emails unsent: `+ unsentEmailsCounter);
  }

  // Email structure

  function processEmails() {
    rows.forEach((row, index) => {
      const email = row[emailColumn];
      const companyName = row[companyNameColumn];
      const contactPerson = row[contactPersonColumn];
      const status = row[statusColumn];

      if (email && (status == "To Send")) {
        const subject = `[SUBJECT HERE] ${companyName}`; // Change the email subject here

        const personalizedBody = `
        Cześć ${contactPerson || companyName},<br><br>
        ${message.getBody()} <!-- Keeps the rest of the draft content -->
      `;

        GmailApp.sendEmail(email, subject, "", {
          htmlBody: personalizedBody
        });

        sheet.getRange(index + 2, statusColumn + 1).setValue("Sent"); // Set Status to Sent
        Logger.log(`Sucessfully sent email to: ` + email);
        sentEmailsCounter++;
      } else {
        unsentEmailsCounter++;
      }
    });

    logAutomationResults();
  }

  if (message) {
    processEmails()
  }
}