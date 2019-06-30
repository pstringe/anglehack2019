const Nominatim = require('nominatim-geocoder');
const geocoder = new Nominatim();
const fb = require("./firebase.js");
const request = require( 'request' );
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require("btoa");
const wml_credentials = new Map();

function apiPost(scoring_url, token, mlInstanceID, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", token);
	oReq.setRequestHeader("ML-Instance-ID", mlInstanceID);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

// NOTE: generate iam_token based on provided documentation

// Paste your Watson Machine Learning service apikey here
var apikey = "_z-D7UGaoMeclhjYsii_ikZc21bGwwQIIOupGQ__4Ikz";

// Use this code as written to get an access token from IBM Cloud REST API
//
var IBM_Cloud_IAM_uid = "bx";
var IBM_Cloud_IAM_pwd = "bx";

var options = { url     : "https://iam.bluemix.net/oidc/token",
                headers : { "Content-Type"  : "application/x-www-form-urlencoded",
                            "Authorization" : "Basic " + btoa( IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd ) },
                body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" };

/*
** callback funciton to perform geocoding and update longitude and lattitude
** if user has address on file
*/

var lat = 0;
var lng = 0;

const getCoords = (data) =>
{
	console.log(data);
	if (data['address']){
		geocoder.search( { q: data['address'] } )
    		.then((response) => {
			lat = response.lat;
			lng = response.lon;
			
        		console.log("in callback");
			console.log(response)
			console.log(data);
    		})
    		.catch((error) => {
        		console.log(error)
    		})
	}	
}

//retrive users form firebase and update longitude/lattidude
fb.fbGet('users', getCoords);

request.post( options, function( error, response, body )
{
	const iam_token = JSON.parse( body )["access_token"];
	const wmlToken = "Bearer " + iam_token;

	// NOTE: retrieve ml_instance_id based on provided documentation
	const mlInstanceId = "da659b8f-3d24-4093-adad-203aa0038f97";

	// NOTE: manually define and pass the array(s) of values to be scored in the next line
	var payload = '{"fields": ["latitude", "longitude"], "values": [[' + lat + ',' + lng + ']]}';
	const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/da659b8f-3d24-4093-adad-203aa0038f97/deployments/07f97798-a45b-4f7e-9150-3542fbd5103d/online";

	apiPost(scoring_url, wmlToken, mlInstanceId, payload, function (resp) {
		let parsedPostResponse;
		try {
			parsedPostResponse = JSON.parse(this.responseText);
		} catch (ex) {
			// TODO: handle parsing exception
		}
		console.log("Scoring response");
		console.log(parsedPostResponse);
	}, function (error) {
	console.log(error);
});
} );


