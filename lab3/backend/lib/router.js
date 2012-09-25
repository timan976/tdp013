
function route(handlers, pathname, request, response) {
	var handler = handlers[pathname];
	if(handler == undefined || typeof handler['callback'] != 'function') {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.write("404 Not Found");
		response.end();
		return;
	}

	console.log(request.method + " " + pathname);

	// Enable CORS
	if(handler.cors_enabled == true) {
		console.log(" --> Enabling cors...");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	}

	if(request.method != "OPTIONS" && handler['method'] != request.method) {
		response.writeHead(405);
		response.end();
		return;
	}

	if(request.method == "OPTIONS") {
		console.log(" --> Closing request.");
		request.end();
	} else {
		console.log(" --> Calling callback.");
		handler['callback'](request, response);
	}
}

exports.route = route;
