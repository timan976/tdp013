
function route(handlers, pathname, request, response) {
	var handler = handlers[pathname];
	if(handler == undefined || typeof handler['callback'] != 'function') {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.write("404 Not Found");
		response.end();
		return;
	}

	if(handler['method'] != request.method) {
		response.writeHead(405);
		response.end();
		return;
	}

	handler['callback'](request, response);
}

exports.route = route;
