HTML_TYPE = 'text/html';
JSON_TYPE = 'application/json';

exports.HTML_TYPE = HTML_TYPE;
exports.JSON_TYPE = JSON_TYPE;

function respond(response, body, content_type, status_code, headers) {
	content_type = typeof content_type == 'undefined' ? HTML_TYPE : content_type; 
	status_code = typeof status_code == 'undefined' ? 200 : status_code;
	headers = typeof headers == 'undefined' ? {} : headers;

	if(headers['Content-Type'] == undefined)
		headers['Content-Type'] = content_type;

	response.writeHead(status_code, headers);
	if(typeof body == 'function')
		body(response);
	response.end();
}

exports.respond = respond;
