/*
UrlFetchApp 
https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app

payload = request body
*/

/*
there is a sleep section just i can't seem to get data from it
derived:com.google.activity.segment:com.urbandroid.sleep:session_activity_segment
*/
var dictonarySyncTopic = {
  "estimatedSteps": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
  "weight": "derived:com.google.weight:com.google.android.gms:merge_weight",
  "calories": "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
}
var syncTopicTypeValue = {
  "weight": "fpVal",
  "estimatedSteps": "intVal",
  "calories": "fpVal"
}

function getFitData(startingDate, endingDate, syncTopic) {
  var originalData;
  if(syncTopic != "activitys"){
    originalData = getAggregateData(startingDate, endingDate, syncTopic);
  }
  else{
    originalData = getSessionData(startingDate, endingDate)
  }

  //Logger.log(allData)
  return originalData;
}


function getAggregateData(startingDate, endingDate, syncTopic){
  var fitService = getOAuthService()
  //Logger.log(dictonarySyncTopic[syncTopic])
  var response = UrlFetchApp.fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      Authorization: 'Bearer ' + fitService.getAccessToken()
    },
    'payload': JSON.stringify({
      "aggregateBy": [{
        "dataSourceId": dictonarySyncTopic[syncTopic]
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": startingDate.getTime(),
      "endTimeMillis": endingDate.getTime()
    })
    
  });
  
  var allData = JSON.parse(response.getContentText())["bucket"].map(function(bucketSection){

    var valueData = undefined;
    if( bucketSection["dataset"][0]["point"].length != 0  ){
      valueData = bucketSection["dataset"][0]["point"][0]["value"][0][syncTopicTypeValue[syncTopic]];
    }
    
    return [
      convertMillisecondsToDate(parseInt(bucketSection.startTimeMillis)),
      convertMillisecondsToDate(parseInt(bucketSection.endTimeMillis)),
      valueData]
           
  })
  return allData;
}

function getSessionData(startingDate, endingDate){
  //
  var fitService = getOAuthService()
  //' +'?startTime='+ startingDate.toISOString() + '&endTime=' + endingDate.toISOString()
  //var response = UrlFetchApp.getRequest('https://www.googleapis.com/fitness/v1/users/me/sessions'); // ?startTime='+ startingDate.toISOString() + '&endTime=' + endingDate.toISOString()
  var response =  UrlFetchApp.fetch('https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=' + startingDate.toISOString() + '&endTime=' + endingDate.toISOString()
  , {
    'method' : 'get',
    'headers': {
      Authorization: 'Bearer ' + fitService.getAccessToken()
    }
  });
  
  var allData = JSON.parse(response.getContentText())["session"].map(function(bucketSection){
    
    return [
      parseInt(bucketSection.startTimeMillis),
      convertMillisecondsToDate(parseInt(bucketSection.endTimeMillis)),
      convertActivityToName(bucketSection["activityType"] ) ]
           
  })
  
  //Logger.log(allData)
  allData.sort(compare)
  allData = allData.map(function(item){
    item[0] = convertMillisecondsToDate(item[0]);
    return item;
  });
  return allData;
}


function compare(a,b) {
  if (a[0] < b[0])
    return -1;
  if (a[0] > b[0])
    return 1;
  return 0;
}
