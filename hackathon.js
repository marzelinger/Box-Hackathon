// first, create google cloud function with correct environment variables
var gcpHeaders = new Headers();
gcpHeaders.append("Content-Type", "application/json");
gcpHeaders.append("Accept", "application/json");
var gcpAuthToken = "ya29.c.KpUBwQcb8fTbpwdTWJkAY7m9JL0XqHXqt13gQP-6Ju4K5ZAVYl6YvrQdAFXbjE5_ttr5WayF-xN0x1pPYvhkU4YJJEfjla8u2wpK2UxuXAVXaVll2AgH5oSDLGEkjkCGDioKptD0ZWpvgDlLgUFTmoapmohkMOLNBOvDcXpgVYquYDFUSIJGqxp6MDoEaM-CDB5LmbNnQQ4";
gcpHeaders.append("Authorization", `Bearer ${gcpHeaders}`);
var gcpFunctionName = "userGeneration11";
var envVariables = {"token":"mkFGPAsCdxssdlw3Lkcsmas6Ygut0zwz"};
var sourceRepo = "https://source.developers.google.com/projects/hackathon-270217/repos/PHackathon2/revisions/220f98e22ca79acc16367ffaa541ff36f2a5a4b6/paths/"
var gcpCreateBody = JSON.stringify({`name":"projects/hackathon-270217/locations/us-central1/functions/${gcpFunctionName}`,"description":"test","runtime":"nodejs8","availableMemoryMb":256,"entryPoint":"generateUser","environmentVariables": envVariables,"sourceRepository":{"url": sourceRepo },"httpsTrigger":{}});
var gcpCreateRequestOptions = {
  method: 'POST',
  headers: gcpHeaders,
  body: gcpCreateBody,
  redirect: 'follow'
};
fetch("https://cloudfunctions.googleapis.com/v1/projects/hackathon-270217/locations/us-central1/functions", gcpCreateRequestOptions)
  .then(gcpCreateResponse => gcpCreateResponse.text())
  .then(gcpCreateResult => console.log(gcpCreateResult))
  .catch(error => console.log('error', error));

// get google cloud function using id in order to get google cloud endpoint

var gcpGetRequestOptions = {
  method: 'GET',
  headers: gcpHeaders,
  redirect: 'follow'
};
fetch(`https://cloudfunctions.googleapis.com/v1/projects/hackathon-270217/locations/us-central1/functions/${gcpFunctionName}`, gcpGetRequestOptions)
  .then(gcpGetResponse => gcpGetResponse.text())
  .then(gcpResult => gcpResult.httpsTrigger.url)
  .catch(error => console.log('error', error));


// create a row in apigee KVM with the correct id and cloud endpoint
var apigeeHeaders = new Headers();
apigeeHeaders.append("Content-Type", "application/json");
var apigeeAuthToken = "bXplbGluZ2VyQGJveC5jb206QmVsbGVyb3NlMSE="
apigeeHeaders.append("Authorization", `Basic ${apigeeAuthToken}`);
var key = "demo";
var gcpEndpoint = "https://us-central1-grand-icon-270223.cloudfunctions.net/myFunction5";
var apigeeBody = JSON.stringify({"name":key,"value":gcpEndpoint});
var apigeeRequestOptions = {
  method: 'POST',
  headers: apigeeHeaders,
  body: apigeeBody,
  redirect: 'follow'
};
var organization = "amer-demo47";
var environment = "test";
fetch(`https://api.enterprise.apigee.com/v1/organizations/${organization}/environments/${environment}/keyvaluemaps/Box-Functions-Map/entries`, requestOptions)
  .then(apigeeResponse => apigeeResponse.text())
  .then(apigeeResult => console.log(apigeeResult))
  .catch(error => console.log('error', error));

var apigeeEndpoint = `https://amer-demo47-test.apigee.net/box-functions/${key}`

// create Okta webhook
var oktaHeaders = new Headers();
var oktaAuthToken = "00ouKk-zMwpRjCy2myqoO_y8mLWCkiv699LjPLNWBo"
oktaHeaders.append("Authorization", `SSWS ${oktaAuthToken}`);
oktaHeaders.append("Content-Type", "application/json");

var oktaBody = JSON.stringify({"name":"Create User Event Hook","events":{"type":"EVENT_TYPE","items":["user.lifecycle.create"]},"channel":{"type":"HTTP","version":"1.0.0","config":{"uri":gcpEndpoint}}});

var oktaCreateRequestOptions = {
  method: 'POST',
  headers: oktaHeaders,
  body: oktaBody,
  redirect: 'follow'
};

var oktaEventHookId = fetch("https://dev-695117.okta.com/api/v1/eventHooks", oktaCreateRequestOptions)
  .then(oktaResponse => oktaResponse.text())
  .then(oktaResult => return oktaResult.id)
  .catch(error => console.log('error', error));

// verify Okta webhook
var oktaVerifyEndpoint = `https://dev-695117.okta.com/api/v1/eventHooks/${oktaEventHookId}/lifecycle/verify`

var oktaVerifyRequestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: "",
  redirect: 'follow'
};

fetch(oktaVerifyEndpoint, oktaVerifyRequestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));


return apigeeEndpoint;
