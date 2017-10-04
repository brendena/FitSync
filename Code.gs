function onOpen() {
  SpreadsheetApp.getUi().createMenu('Fit Sync')
      .addItem('Menu', 'showSidebar')
      .addItem('Refresh Data', 'loadDataToSpreadSheet')
      .addToUi();
   Logger.log("started");
  loadDataToSpreadSheet();
}


function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Fit Sync')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

function onInstall(){
  ScriptApp.newTrigger('loadDataToSpreadSheet')
      .timeBased()
      .everyHours(24)
      .create();
}

