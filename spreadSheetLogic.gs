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
    //add a couple seconds so you can't include the results from the last successfull
    //return
    //startingDate = new Date(startingDate.getTime() + 6000 );
    if(mySpreadSheetObject.headerPresent() === false){
      mySpreadSheetObject.headerValues(getHeadersData(syncTopic));
    }
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //   endingDate = 
    //  know -
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                               
    var timePerRowData = getEarliestNextCall(syncTopic);
    var knowMilli = new Date().getTime();
    var endingDate = new Date( knowMilli - (knowMilli % timePerRowData)  )
    var dateManager = GeneratorDateManager(new Date(startingDate.getTime() + timePerRowData),endingDate,30)

    if(dateManager.valid()){
      do{
        var data = getFitData(dateManager.getStartingDate(),dateManager.getEndingDate(), syncTopic);
        if(data.length !== 0)
          mySpreadSheetObject.append(data);
  
      }
      while(dateManager.next());
    }
    else{
      Logger.log("can't have a starting date before today or refreshed to soon");
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
      Logger.log(this.getStartingDate())
      Logger.log(this.getEndingDate())
      return !(this.compareDateGreaterThenDate(this.getStartingDate(), this.getEndingDate() ) )
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
      if(this.compareDateGreaterThenDate(newEndingDate, this._endingDate))
        return this._endingDate;
      return newEndingDate;
    },
    calculateDate: function(num){
      return new Date(this._startingDate.getTime() + num * this._itterationAmmount * 86400000)//iteration amount times milliseconds in a day
    },
    compareDateGreaterThenDate: function(date1, date2){
      return (date1.getTime() > date2.getTime())
    }
  }
} 
