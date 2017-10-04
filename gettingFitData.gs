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
  var fitService = getOAuthService()
  Logger.log(dictonarySyncTopic[syncTopic])
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
  //Logger.log(allData)
  return allData;
}

