function getOauth2(){
  var oAuthService = getOAuthService();
  if (!oAuthService.hasAccess()) {
    var authorizationUrl = oAuthService.getAuthorizationUrl();
    return authorizationUrl;
  }
  return "";
}

function savePageSetting(setting){
  Logger.log(setting)
  saveProperties(setting);
  startNewSpreadSheet();
  return "saved";
}

function getPageSetting(){
  return getAllSavedProperties();
}

