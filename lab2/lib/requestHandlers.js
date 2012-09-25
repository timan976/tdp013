var mongo = require('mongodb');

var url = require('url');
var db;

function set_database(new_db) {
	db = new_db;
}

function index(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("Hello, World!");
	res.end();
}

function save_message(req, res) {
	var msg = url.parse(req.url, true).query['message'];
	if(typeof msg == 'undefined') {
		res.writeHead(400, {'Content-Type': 'text/html'});
		res.write("400 Bad Request - No message specified");
		res.end();
		return;
	}

	if(msg.length > 140) {
		res.writeHead(400, {'Content-Type': 'text/html'});
		res.write("400 Bad Request - Message too long");
		res.end();
		return;
	}

	db.collection("message", function(e, c) {
		c.insert({'message': msg, 'read': false}, function(e, result) {
			if(e) {
				res.writeHead(500, {'Content-Type': 'text/html'});
				res.write("500 Internal Server Error");
			} else {
				res.writeHead(200);
			}
			res.end();
		});
	});
}

function flag_message(req, res) {
	var msg_id = url.parse(req.url, true).query['id'];
	if(typeof msg_id == 'undefined' || msg_id.length != 24) {
		res.writeHead(400, {'Content-Type': 'text/html'});
		res.write("400 Bad Request");
		res.end();
		return;
	}

	msg_id = new mongo.BSONPure.ObjectID(msg_id);
	db.collection("message", function(e, c) {
		c.update({_id: msg_id}, {$set: {read: true}}, function(find_err, msg_doc) {
			if(find_err) {
				res.writeHead(500, {'Content-Type': 'text/html'});
				res.write("500 Internal Server Error");
			} else {
				res.writeHead(200);
			}
			res.end();
		});
	});
}

function messages(req, res) {
	db.collection("message", function(e, c) {
		c.find().toArray(function(err, docs) {
			if(err) {
				res.writeHead(500, {'Content-Type': 'text/html'});
				res.write("500 Internal Server Error");
			} else {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.write(JSON.stringify(docs));
			}
			res.end();
		});
	});
}

exports.index = index;
exports.save_message = save_message;
exports.flag_message = flag_message;
exports.messages = messages;
exports.set_database = set_database;
