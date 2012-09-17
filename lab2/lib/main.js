var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handlers = {
	'/': {'method': 'GET', 'callback': requestHandlers.index},
	'/save': {'method': 'GET', 'callback': requestHandlers.save_message},
	'/flag': {'method': 'GET', 'callback': requestHandlers.flag_message},
	'/getall': {'method': 'GET', 'callback': requestHandlers.messages}
};

server.start(router.route, handlers);
