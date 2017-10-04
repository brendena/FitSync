function staticVars() {
  return {
    "milliSecondsDay": 86400000,
    "milliSecondsMonth": 2592000000
  }
}


function convertMillisecondsToDate(milliSeconds){
  return new Date(milliSeconds).toString()

}