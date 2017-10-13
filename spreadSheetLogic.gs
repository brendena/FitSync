function startNewSpreadSheet(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var mySpreadSheetObject = createSpreadSheetObject(ss);
  mySpreadSheetObject.clearAllSheets();
  loadDataToSpreadSheet();
}

/*load all the data into the spread sheet*/
function loadDataToSpreadSheet(){
  
  var mySpreadSheetObject = createSpreadSheetObject(SpreadsheetApp.getActiveSpreadsheet());
  var fitTopicsSync = getSpecificSavedProperties("fitSyncData")
  mySpreadSheetObject.checkAndCreateSheets(fitTopicsSync);
  
  fitTopicsSync.forEach(function(syncTopic){
    Logger.log("going through");
    mySpreadSheetObject.setActiveSheet(syncTopic);
    //get last logged date
    var startingDate = new Date(mySpreadSheetObject.getCellValue(-1,2));
    
    if(startingDate.toString() === "Invalid Date" ){
      startingDate = getDateWithOffset(new Date(getSpecificSavedProperties("startingDate")));
      mySpreadSheetObject.clearSheet();
    }
    
    if(mySpreadSheetObject.headerPresent() === false){
      mySpreadSheetObject.headerValues(getHeadersData(syncTopic));
    }
                                                      // setHours return a number
    var dateManager = GeneratorDateManager(startingDate,new Date(new Date().setHours(0,0,0,0)),30)

    if(dateManager.valid()){
      do{
        var data = getFitData(dateManager.getStartingDate(),dateManager.getEndingDate(), syncTopic);
        mySpreadSheetObject.append(data);
  
      }
      while(dateManager.next());
    }
    else{
      throw "can't have a starting date before today";
    }

    
  })
}

//Object that holds today
//hold
function GeneratorDateManager(startingDate, endingDate, itterationAmmount){
  
  return{
    _startingDate: startingDate,
    _endingDate: endingDate,
    _itterationAmmount: itterationAmmount,
    _itteration: 0,
    reset: function(){
      this._itteration = 0
    },
    valid: function(){
      var startingDate = this.getStartingDate();
      var endingDate = this.getEndingDate();
      if(startingDate < endingDate){
        return true;
      }
      return false;
    },
    next: function(){
      this._itteration++;
      return this.valid();
    },
    getStartingDate: function(){
      return this.calculateDate(this._itteration);
    },
    getEndingDate: function(){
      var newEndingDate = this.calculateDate(this._itteration + 1);
      if(newEndingDate > this._endingDate)
        return this._endingDate;
      return newEndingDate;
    },
    calculateDate: function(num){
      return new Date(this._startingDate.getTime() + num * this._itterationAmmount * 86400000)//iteration amount times milliseconds in a day
    }
  }
} 
