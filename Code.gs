//https://developers.google.com/apps-script/guides/services/authorization#manual_authorization_scopes_for_sheets_docs_and_forms
/*
Make the extension only avaible to the current document
*/
/**
 * @OnlyCurrentDoc
 */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Fit Sync')
      .addItem('Menu', 'showSidebar')
      .addItem('Refresh Data', 'loadDataToSpreadSheet')
      .addToUi();
   Logger.log("started");
  loadDataToSpreadSheet();
}


function showSidebar() {
  var html = doGet().setTitle('Fit Sync').setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

function onInstall(){
  onOpen();
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