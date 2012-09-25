var http = require("http")
var url = require("url")
var mongo = require("mongodb")

function start(route, handlers, callback) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		route(handlers, pathname, request, response);
	}

	var mongo_server = new mongo.Server('localhost', 27017);
	var db = new mongo.Db('tdp013', mongo_server);

	// Open a connection to the database
	db.open(function(err, db) {
		if(err) {
			console.log("Error connecting to database:\n" + err);
		} else {
			http.createServer(onRequest).listen(8888);
			console.log("Server started on http://localhost:8888/");
			if(callback != undefined)
				callback(db);
		}
	});

}

exports.start = start;
