var should = require('should');
var request = require('superagent');
var assert = require('assert');

require('../lib-coverage/main.js');

var port = 8888;
var endpoint = "http://localhost:" + port;

describe("Server", function() {
	describe("GET /", function() {
		it("should return 'Hello, World!'", function(done) {
			request(endpoint).end(function(response) {
				response.text.should.equal("Hello, World!");
				done();
			});
		});
	});

	// Test error pages first
	describe("GET /404", function() {
		it("should return 404", function(done) {
			request(endpoint + "/404").end(function(response) {
				response.status.should.equal(404);
				done();
			});
		});
	});

	describe("GET /save?msg=foo", function() {
		it("should return 400", function(done) {
			request(endpoint + "/save?msg=foo").end(function(response) {
				response.status.should.equal(400);
				done();
			});
		});
	});

	describe("POST /getall", function() {
		it("should return 405", function(done) {
			request.post(endpoint + "/getall").end(function(response) {
				response.status.should.equal(405);
				done();
			});
		});
	});

	// Start testing API functionality

	// Try saving a message that is longer than 140 characters
	describe("GET /save with long message", function() {
		it("should return 400", function(done) {
			var long_message = "";
			var i;
			for(i = 0; i < 150; i++)
				long_message += "a";
			request(endpoint + "/save?message=" + long_message).end(function(response) {
				response.status.should.equal(400);
				done();
			});
		});
	});

	// Generate a test message used for the next two tests
	// We do this to be sure that the message was really added
	// to the database, and wasn't there from earlier.
	var test_message = "test_" + (new Date).getTime();
	describe("GET /save?message=" + test_message, function() {
		it("should return 200", function(done) {
			request(endpoint + "/save?message=" + test_message).end(function(response) {
				response.status.should.equal(200);
				done();
			});
		});
	});

	var message_id;
	describe("GET /getall", function() {
		it("should return 200 and a message (JSON object)", function(done) {
			request(endpoint + "/getall").end(function(response) {
				response.status.should.equal(200);

				var messages = JSON.parse(response.text);
				should.exist(messages);

				var last_message = messages[messages.length - 1];
				last_message.message.should.equal(test_message);
				last_message.read.should.be.false;

				// Store the message id for the next test
				message_id = last_message._id;

				done();
			});
		});
	});

	// Try specifying an invalid id for /flag
	describe("GET /flag with malformed id", function() {
		it("should return 400", function(done) {
			request(endpoint + "/flag?id=foo").end(function(response) {
				response.status.should.equal(400);
				done();
			});
		});
	});

	// Try flagging a message as read
	describe("GET /flag", function() {
		it("should return 200 and update the 'read' property", function(done) {
			request(endpoint + "/flag?id=" + message_id).end(function(response) {
				response.status.should.equal(200);
				done();
			});
		});
	});

	// Make sure the message was flagged as read
	describe("GET /getall", function() {
		it("should have updated the 'read' property", function(done) {
			request(endpoint + "/getall").end(function(response) {
				response.status.should.equal(200);
				
				var messages = JSON.parse(response.text);
				should.exist(messages);

				var last_message = messages[messages.length - 1];
				last_message.read.should.be.true;

				done();
			});
		});
	});
});

