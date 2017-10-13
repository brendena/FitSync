/*
UrlFetchApp 
https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app

payload = request body
*/

/*
there is a sleep section just i can't seem to get data from it
derived:com.google.activity.segment:com.urbandroid.sleep:session_activity_segment
*/
var syncTopicConst = {
  "estimatedSteps":{
    "requestInfo":{
      "sourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      "duration": 86400000
    },
    "header": ["start","stop","estimated steps"]
  },
  "weight":{
    "requestInfo":{
      "sourceId": "derived:com.google.weight:com.google.android.gms:merge_weight",
      "duration": 86400000
    },
    "header": ["start","stop","average - weight","max - weight","min - weight"]
  },
  "calories":{
    "requestInfo":{
      "sourceId": "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
      "duration": 86400000
    },
    "header": ["start","stop","calories - kCal"]
  },
  "heartRate":{
    "requestInfo":{
      "sourceId": "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
      "duration": 120000 // 5 minutes
    },
    "header": ["start","stop","average - BPM","max - BPM","min - BPM"],
  },
  "activitys":{
    "header": ["start","stop","activitys"]
  }
}


var dataTypeValues = {
  "com.google.step_count.delta": ["intVal"],
  "com.google.calories.expended": ["fpVal"],
  "com.google.heart_rate.summary": ["fpVal","fpVal","fpVal"],
  "com.google.weight.summary":  ["fpVal","fpVal","fpVal"],
  "com.google.calories.expended": ["fpVal"]
}

function getHeadersData(syncTopic){
  return syncTopicConst[syncTopic].header;
}

function getFitData(startingDate, endingDate, syncTopic) {
  var originalData;
  if(syncTopic != "activitys"){
    originalData = getAggregateData(startingDate, endingDate, syncTopic);
  }
  else{
    originalData = getSessionData(startingDate, endingDate, syncTopic)
  }
  return originalData;
}


function getAggregateData(startingDate, endingDate, syncTopic){
  var fitService = getOAuthService()
  //Logger.log(dictonarySyncTopic[syncTopic])
  Logger.log(syncTopic);
  var response = UrlFetchApp.fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      Authorization: 'Bearer ' + fitService.getAccessToken()
    },
    'payload': JSON.stringify({
      "aggregateBy": [{
        "dataSourceId": syncTopicConst[syncTopic]["requestInfo"].sourceId
      }],
      "bucketByTime": { "durationMillis": syncTopicConst[syncTopic]["requestInfo"].duration },
      "startTimeMillis": startingDate.getTime(),
      "endTimeMillis": endingDate.getTime()
    })
  });
  
  var allData = JSON.parse(response.getContentText())["bucket"]
  
  allData = allData.filter(function(bucket){
    return bucket["dataset"][0]["point"].length != 0; 
  }).map(function(bucket){
    return parseBucketSection(bucket["dataset"][0]["point"][0]);
  });


  return allData;
}

function getSessionData(startingDate, endingDate, syncTopic){
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
    return parseBucketSection(bucketSection);
  })
  
  //Logger.log(allData)
  allData.sort(compare)
  return allData;
}


function compare(a,b) {
  var tmpA = new Date(a[0]);
  var tmpB = new Date(b[0])
  if (tmpA < tmpB)
    return -1;
  if (tmpA > tmpB)
    return 1;
  return 0;
}

function parseBucketSection(bucketSection){
  var returnArray= []
  if(bucketSection.startTimeNanos != undefined){
    returnArray.push(convertFitnessDataTypes(bucketSection.startTimeNanos,"dateNano"));
    returnArray.push(convertFitnessDataTypes(bucketSection.endTimeNanos, "dateNano"))
  }
  else{
    returnArray.push(convertFitnessDataTypes(bucketSection.startTimeMillis,"dateMilli"));
    returnArray.push(convertFitnessDataTypes(bucketSection.endTimeMillis, "dateMilli"))
  }
  if(bucketSection["activityType"] != undefined){
    returnArray.push(convertFitnessDataTypes(bucketSection["activityType"], "activitys"));
  }
  else if(bucketSection["value"] != undefined){
 
    var specificDataTypesValues =  dataTypeValues[bucketSection["dataTypeName"]];
    Logger.log(specificDataTypesValues);
    if(bucketSection["value"].length == specificDataTypesValues.length ){
      for(var i = 0; i < bucketSection["value"].length; i++){
         
        returnArray.push(convertFitnessDataTypes(bucketSection["value"][i][specificDataTypesValues[i]], specificDataTypesValues[i]))
      }
    }
  }
  else{
    throw "something wen't wrong with the data"
  }
  return returnArray;
}
//valueData = bucketSection["dataset"][0]["point"][0]["value"][0][syncTopicTypeValue[syncTopic]];
function convertFitnessDataTypes(value,type){
  
  returnValue = undefined;
  switch(type){
    case "dateNano":
      returnValue = convertNanosecondsToDate(parseInt(value));
      break;
    case "dateMilli":
      returnValue = convertMillisecondsToDate(parseInt(value));
      break;
    case "intVal":
    case "fpVal":
      Logger.log(type)
      Logger.log(value)
      returnValue = Number(value);
      break;
    case "activitys":
      returnValue = convertActivityToName(value);
      break;
    default:
       throw "Error currently unsupported type"
  }
  return returnValue;
}