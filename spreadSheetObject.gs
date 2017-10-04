/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/  This will become the javascript 
/  library object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


function createSpreadSheetObject(spreadSheet){
  //create spreadSheet with id
  var objectSpreadSheet = undefined;
  //Logger.log(spreadSheet.toString());
  switch(spreadSheet.toString()){
    case "Spreadsheet":
      objectSpreadSheet = spreadSheet;
      break;
    //default: 
      //basic string id
  }
  return {
    "spreadSheetObject" : objectSpreadSheet,
    "activeSpreadSheet": objectSpreadSheet.getSheets()[0],
    "append":function(data){
      var lastRow =  this["activeSpreadSheet"].getLastRow() + 1;
      this["activeSpreadSheet"].getRange(lastRow, 1, 
                                         data.length, 
                                         data[0].length).setValues(data);
    },
    "getAllValues":function(){
      return this["activeSpreadSheet"].getRange(2,1,this["activeSpreadSheet"].getLastRow(),this["activeSpreadSheet"].getLastColumn()).getValues()
    },
    "clearSheet": function(){
      this["activeSpreadSheet"].clear();
    },
    "clearAllSheets": function(){
      var allCreatedSheets = this["spreadSheetObject"].getSheets();
      allCreatedSheets.forEach(function(sheet){
        sheet.clear();
      }.bind(this));
    },
    "getCellValue": function(row,column){
      if(row == -1){
        row = this["activeSpreadSheet"].getLastRow()
      }
      if(row == 0)
        return "";
      else
        return this["activeSpreadSheet"].getRange(row,column).getValues()[0][0];
    },
    "checkAndCreateSheets": function(listSheetsNeeded){
    //getSheetByName(name)
      var allCreatedSheets = this["spreadSheetObject"].getSheets();
      var allCreatedSheetsNames = [];
      
      for(var i = 0; i < allCreatedSheets.length; i++){
        allCreatedSheetsNames.push(allCreatedSheets[i].getName())
      }
      for(i = 0; i < listSheetsNeeded.length; i++){
        if(allCreatedSheetsNames.indexOf(listSheetsNeeded[i]) == -1){
          this["spreadSheetObject"].insertSheet(listSheetsNeeded[i]);
        }
      }
    },
    "setActiveSheet": function(name){
      this["activeSpreadSheet"] = this["spreadSheetObject"].getSheetByName(name);
    },
    "headerPresent": function(){
      this["activeSpreadSheet"].getRange(1, 1);
      if(this["activeSpreadSheet"].getRange(1, 1).getValues()[0][0] == "")
        return false;
      return true;
    },
    "headerValues": function(header){
        this["activeSpreadSheet"].getRange(1, 1, 1, header.length).setValues([header]);
    }
  }
}