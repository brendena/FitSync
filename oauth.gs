/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/  This hold only the code for authorizing
/  the google fit application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//have to tell it is auth 2
//https://developers.google.com/datastudio/connector/reference#authtype



/* 

all these function are defined here
https://developers.google.com/datastudio/connector/oauth2

*/

var Keys = getOAuthKeys();

function getOAuthService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('fit data')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(Keys.CLIENT_ID)
      .setClientSecret(Keys.CLIENT_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope('https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read')
      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('access_type', 'offline')
      .setParam('login_hint', Session.getActiveUser().getEmail())
    .setParam('approval_prompt', 'auto');
}

function authCallback(request) {
  var driveService = getOAuthService();
  var isAuthorized = driveService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function isAuthValid() {
  var service = getOAuthService();
  if (service == null) {
    return false;
  }
  return service.hasAccess();
}


function get3PAuthorizationUrls() {
  var service = getOAuthService();
  if (service == null) {
    return '';
  }
  return service.getAuthorizationUrl();
}

function resetAuth() {
  var service = getOAuthService()
  service.reset();
}
