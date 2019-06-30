
const firebase = require('firebase');

var firebaseConfig = {
	apiKey: "AIzaSyDfkuoYNCDdurtDvCp0EchV9BzM6DioStE",
	authDomain: "angel-hck.firebaseapp.com",
	databaseURL: "https://angel-hck.firebaseio.c",
	projectId: "angel-hck",
	storageBucket: "",
	messagingSenderId: "922124163750",
	appId: "1:922124163750:web:514e5537a3bc73f5"
 };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var exports = module.exports = { };
/*
** example data schema
*/

/*
var data = {
	name: "fdp",
	"cel": "cor1",
	"email": "joao@gmail.com",
	"lat": "1400144",
	"long": "4192491",
	"risk": "35",
	"tojo1":15,     
}
*/

/*
** get data from firebase, pass in field
*/

exports.fbGet = function(field, callback) {
	//const id = "8BYyMD3ewCC21qzir2dE";

	db.collection(field).get().then(function(query){
		query.forEach(function(doc) {
			callback(doc.data( ));
		});
	})
},

exports.fbUpdate= function(field, id, key, value) {
	console.log(id);
	console.log(db.collection(field).doc());
	db.collection("users").doc(id).update({
			key : value
		}).then(function() {
	    console.log("nice!");
	});
}
