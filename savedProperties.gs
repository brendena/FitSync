// array for document ids
var nameGlobalProperties = "savedProperties"

function getAllSavedProperties(){
  var savedPropertiesString =  getUserProperties().getProperty(nameGlobalProperties);
  var savedPropertiesJson = JSON.parse(savedPropertiesString)
  if(savedPropertiesJson == null || typeof(savedPropertiesJson) !== "object" ||savedPropertiesJson == 'undefined' || Array.isArray(savedPropertiesJson) === true){ // typeof(savedPropertiesJson) === "Object" ||
    savedPropertiesJson = {};
  }
  return savedPropertiesJson;
}

function getSpecificSavedProperties(properties){
  var savedProperties = getAllSavedProperties();
  var returnProperties = undefined;
  if(Array.isArray(properties)){
    returnProperties = {};
    properties.forEach(function(property){
      returnProperties[property] = savedProperties[property];
    });
  }
  else{
    returnProperties = savedProperties[properties];
  }
  return returnProperties;
}

function savePropertie(propertyName, value){
  try {
    var savedProperties = this.getAllSavedProperties();
    savedProperties[propertyName] = value
    saveProperties(savedProperties);
  } catch (f) {
    Logger.log(f.toString());
  }
}

function saveProperties(JsonProperties){
  getUserProperties().setProperty(nameGlobalProperties, JSON.stringify(JsonProperties));
}



function resetProperties() {
  saveProperties({});
}

 

function getUserProperties(){
  return  PropertiesService.getUserProperties();
}