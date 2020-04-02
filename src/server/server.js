var express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const handleSockets = require('./socket-handler.js').handleSockets;

const port = process.env.PORT || 3000;

function startServer() {
	return new Promise(function(resolve, reject) {
		handleSockets(io); // socket.io app logic

		if(process.env.NODE_END !== "development") {
			app.use(express.static('dist'));
		}

		httpServer.listen(port, function() {
			console.log(`httpServer listening on port ${port}`);
			resolve();
		});
	});
}

module.exports = {
    'startServer': startServer()
};
