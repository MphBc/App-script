function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('บันทึกค่าเดินทาง');
}

function processButtonClick(buttonNumber) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('UOB'); // Ensure the sheet name matches exactly

    if (!sheet) {
      throw new Error('Sheet "UOB" not found.');
    }

    const now = new Date();
    const lastRow = sheet.getRange("A:A").getValues().filter(row => row[0] !== "").length;
    const nextRow = lastRow + 1;

    if (buttonNumber === 1) {
      sheet.getRange(nextRow, 1).setValue(now);
      sheet.getRange(nextRow, 2).setValue(42);
      sheet.getRange(nextRow, 5).setValue('1เที่ยว MRT');
    } else if (buttonNumber === 2) {
      sheet.getRange(nextRow, 1).setValue(now);
      sheet.getRange(nextRow, 2).setValue(72);
      sheet.getRange(nextRow, 5).setValue('2เที่ยว MRT');
    } else if (buttonNumber === 3) {
      sheet.getRange(nextRow, 1).setValue(now);
      sheet.getRange(nextRow, 2).setValue(60);
      sheet.getRange(nextRow, 5).setValue('Amazon');
    } else if (buttonNumber === 4) {
      sheet.getRange(nextRow, 1).setValue(now);
      sheet.getRange(nextRow, 2).setValue(300);
      sheet.getRange(nextRow, 5).setValue('น้ำมัน');
    } else {
      throw new Error('Invalid button number.');
    }

    const formattedDateTime = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );

    return formattedDateTime;
  } catch (error) {
    Logger.log('Error in processButtonClick: ' + error.toString());
    throw new Error('Failed to record data: ' + error.toString());
  }
}

function getTableData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('table1');

    if (!sheet) {
      throw new Error('Sheet "table1" not found.');
    }

    // Get the last row with data
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // Return empty array if no data

    // Calculate the starting row for the last 5 rows
    const startRow = Math.max(2, lastRow - 4); // Minimum start at row 2 to avoid headers
    const numRows = lastRow - startRow + 1;

    // Get the range for the last 5 rows
    const range = sheet.getRange(startRow, 1, numRows, sheet.getLastColumn());
    const values = range.getValues();

    // Filter out completely empty rows and format the data
    const formattedValues = values.filter(row => row.some(cell => cell !== '')).map(row => {
      return row.map(cell => {
        // Format dates if the cell contains a date
        if (cell instanceof Date) {
          return Utilities.formatDate(cell, Session.getScriptTimeZone(), 'dd/MM/yyyy');
        }
        return cell || '';
      });
    });

    Logger.log('Last 5 rows data: ' + JSON.stringify(formattedValues));
    return formattedValues;
  } catch (error) {
    Logger.log('Error in getLast5Rows: ' + error.toString());
    throw new Error('Failed to retrieve last 5 rows: ' + error.message);
  }
}

function processCustomInput(expense, income, note) {
 try {
    // Get the spreadsheet and specific sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('UOB'); // Ensure the sheet name matches exactly
    
    if (!sheet) {
      throw new Error('Sheet "UOB" not found.');
    }
    
    // Get current date and time
    const now = new Date();
    
    // Find the last row with data in column A
    const lastRow = sheet.getRange("A:A").getValues().filter(row => row[0] !== "").length;
    const nextRow = lastRow + 1;
    
    // Calculate new balance
    const expenseValue = parseFloat(expense) || 0;
    const incomeValue = parseFloat(income) || 0;

    // Write data to the sheet
    // Columns: Date | จ่าย | รายรับ | หมายเหตุ
    sheet.getRange(nextRow, 1).setValue(now);  // Column A: Date
    sheet.getRange(nextRow, 2).setValue(expenseValue || '');  // Column B: จ่าย
    sheet.getRange(nextRow, 3).setValue(incomeValue || '');   // Column C: รายรับ
    sheet.getRange(nextRow, 5).setValue(note || '');          // Column E: หมายเหตุ
    
    return `Custom data recorded at row ${nextRow}: Expense=${expenseValue}, Income=${incomeValue}`;
    
  } catch (error) {
    throw new Error('Error in processCustomInput: ' + error.message);
  }
}
