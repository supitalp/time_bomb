const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var connected_users = [];

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});

Socketio.on("connection", socket => {
	console.log("New connection from socket: " + socket.id);

	socket.on("USER_JOIN_ROOM", username => {
		console.log("New user login: " + username);
		connected_users.push({id: socket.id, username: username});
		Socketio.emit("USER_JOIN_ROOM", connected_users);
	});

	socket.on("disconnect", () => {
		console.log('User ' + socket.id + ' disconnected...');
		// remove corresponding user from list of users
		connected_users = connected_users.filter(e => e.id !== socket.id);
		// broadcast new list of users ("room state") to everyone
		Socketio.emit("USER_JOIN_ROOM", connected_users);
	});

	socket.on("START_GAME", () => {
		console.log('User ' + socket.id + ' asked to start game');
		Socketio.emit("START_GAME");
	});
});