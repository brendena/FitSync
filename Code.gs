function onOpen() {
  SpreadsheetApp.getUi().createMenu('Fit Sync')
      .addItem('Menu', 'showSidebar')
      .addItem('Refresh Data', 'loadDataToSpreadSheet')
      .addToUi();
   Logger.log("started");
  loadDataToSpreadSheet();
}


function showSidebar() {
  /* old way of doing it
  var html = HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Fit Sync')
      .setWidth(300);
   */
  var html = doGet().setTitle('Fit Sync').setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

function onInstall(){
  ScriptApp.newTrigger('loadDataToSpreadSheet')
      .timeBased()
      .everyHours(24)
      .create();
}


function doGet() {
  return HtmlService
      .createTemplateFromFile('Page')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}