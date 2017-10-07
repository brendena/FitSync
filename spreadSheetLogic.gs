function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mySpreadSheetObject = createSpreadSheetObject(ss);
  var data = getFitData()
  mySpreadSheetObject.append(data);
  //sheet.getRange(2,1,data.length,data[0].length).setValues(data);
}

function startNewSpreadSheet(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mySpreadSheetObject = createSpreadSheetObject(ss);
  mySpreadSheetObject.clearAllSheets();
  loadDataToSpreadSheet();
}

/*load all the data into the spread sheet*/
function loadDataToSpreadSheet(){

  //
  var todayDate = new Date()
  todayDate.setHours(0,0,0,0);
  
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mySpreadSheetObject = createSpreadSheetObject(ss);
  
  
  var fitTopicsSync = getSpecificSavedProperties("fitSyncData")
  
  mySpreadSheetObject.checkAndCreateSheets(fitTopicsSync);
  
  fitTopicsSync.forEach(function(syncTopic){
    Logger.log("going through");
    mySpreadSheetObject.setActiveSheet(syncTopic);
    //get last logged date
    var startingDate = new Date(mySpreadSheetObject.getCellValue(-1,2));
    
    if(startingDate.toString() === "Invalid Date" ){
      /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      /  The dates get entered wrong if you
      /  don't manually put them in.
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
      dateString = getSpecificSavedProperties("startingDate");
      var parts = dateString.match(/(\d+)/g);
      // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
      startingDate = new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
      
      mySpreadSheetObject.clearSheet();
    }
    if(mySpreadSheetObject.headerPresent() === false){
      mySpreadSheetObject.headerValues(["start", "end", syncTopic]);
    }
    var jumpAmount = 30;
    var numberOfSeconds = startingDate.getTime();
    for(var i = 0; startingDate < todayDate; i++){
      //There a problem assigning ending date from starting date
      //It just doesn't work properly.
      var endingDate = new Date(numberOfSeconds);
      endingDate.setDate(jumpAmount * i);
      if(endingDate >= todayDate){
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        /  Can't do endingDate = todayDate because
        /  It will pass it in by reference and 
        /  whenever you chagne endingDate it will
        /  Change todays date.  Resulting in a 
        /  unending loop where startingDate is always
        /  less then todayDate
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        endingDate = new Date();
        endingDate.setHours(0,0,0,0);
      }
      var data = getFitData(startingDate, endingDate, syncTopic);
      mySpreadSheetObject.append(data);
      startingDate.setDate(startingDate.getDate() + jumpAmount);
      
    }
  })
 
}
