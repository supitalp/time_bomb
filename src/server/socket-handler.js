const User = require('../common/user.js').User;
const Card = require('../common/card.js').Card;
const ClientAdapter = require('./game-room.js').ClientAdapter;
const Lobby = require('./lobby.js');
const GAME_PHASE = require('../common/game-phase.js');
const GAME_END = require('../common/game-end');
const GameError = require('./game-error.js').GameError;
const MESSAGE = require('../common/message.js');
const debugLog = require('../common/debug-log.js').debugLog;


function handleSockets(io) {
	io.on('connection', function(sock) {
		debugLog('Socket connected: ' + sock.id);
		Object.keys(MessageHandlers).forEach((messageName) => {
			sock.on(messageName, function(data) {
				try {
					MessageHandlers[messageName](io, sock, data);
				} catch(e) {
					// REMEMBER, any code/mutations inside the try before the error do still execute
					if(e.name === GameError.name) {
						sock.emit(messageName, {
							err: e.clientMessage,
						});
					} else {
						throw e;
					}
				}
			});
		});
	});
}

const MessageHandlers = {
	[MESSAGE.CREATE_ROOM](io, sock, data) {
		GamePrecond.sockDoesNotHaveUser(sock);
		GamePrecond.lobbyIsNotFull();

        let user = login(sock, data.username);
        let newRoom = Lobby.createRoom();

		joinRoom(user, newRoom, false, true);

		io.in(newRoom.roomCode).emit(MESSAGE.CREATE_ROOM, {
			username: user.name,
			roomState: ClientAdapter.generateStateJson(newRoom),
		});
	},

	[MESSAGE.JOIN_ROOM](io, sock, data) {
		let roomToJoin = Lobby.getRoomByCode(data.roomCode);

		GamePrecond.sockDoesNotHaveUser(sock);
		GamePrecond.roomExists(data.roomCode);

		let user;

		if(data.rejoin) {
			GamePrecond.nameIsTakenInRoom(data.username, roomToJoin);
			GamePrecond.gameInProgress(roomToJoin);
			user = login(sock, data.username, roomToJoin);
			joinRoom(user, roomToJoin, true, false);
		} else {
			GamePrecond.roomIsNotFull(roomToJoin);
			GamePrecond.gameNotInProgress(roomToJoin);
			GamePrecond.nameIsNotTakenInRoom(data.username, roomToJoin);
			user = login(sock, data.username);
			joinRoom(user, roomToJoin, false, false);
		}
		broadcastRoomState(io, roomToJoin, MESSAGE.JOIN_ROOM);
	},

	[MESSAGE.LEAVE_ROOM](io, sock, data) {
        GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		let user = sock.user;
		let room = user.gameRoom;
        logout(sock);

		// also, tell other players in room that this player has left
		broadcastRoomState(io, room, MESSAGE.USER_LEFT, (res) => {
			res.username = user.name;
			return res;
		});
	},

	[MESSAGE.START_GAME](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		let rm = sock.user.gameRoom;
		rm.startNewGame();
		broadcastRoomState(io, rm, MESSAGE.START_GAME);
	},

	[MESSAGE.SELECT_CARD](io, sock, data) {
		GamePrecond.sockHasUser(sock);
		GamePrecond.userIsInARoom(sock.user);
		GamePrecond.gameInProgress(sock.user.gameRoom);
		GamePrecond.isUsersTurn(sock.user);
        let rm = sock.user.gameRoom;
        rm.uncoverCard(data.card_id);
        if(rm.gameEnd !== undefined) {
            broadcastRoomState(io, rm, MESSAGE.END_GAME);
            return;
        }
		message = rm.nextTurn();
		broadcastRoomState(io, rm, message);
	},

	disconnect(io, sock, data) {
		let user = sock.user;
		if(user) {
			let room = user.gameRoom;
			logout(sock);
			if(room) {
                console.log(`Rm${room.roomCode} Disconnect: ${user.logName}`);
				broadcastRoomState(io, room, MESSAGE.END_GAME, (res) => {
                    res.username = user.name;
                    res.gameEnd = GAME_END.USER_DISCONNECTED;
					return res;
				});
			}
		}
	},
};

function login(sock, username, roomToRejoin) {
	username = username.trim();
	let user;
	if(roomToRejoin) {
		debugLog(`Attempt reconnect: <${username}>`);
		user = roomToRejoin.findUser(username);
		user.socket = sock;
	} else {
		user = new User(sock, username);
	}
	sock.user = user;
	debugLog(`Login: ${user.logName}`);
	return user;
}
function logout(sock) {
	let user = sock.user;
	if(user) {
		sock.user = undefined;
		user.socket = undefined;

		let room = user.gameRoom;
		if(room) {
			sock.leave(room.roomCode);
			if(room.phase === GAME_PHASE.SETUP) {
				// if room has no game yet, remove the user from the room completely
				room.dropUser(user);
				debugLog(`Rm${room.roomCode} Left room: ${user.logName}`);
			} else {
				debugLog(`Logout ${user.logName}`);
			}
			if(room.isDead()) {
				console.log(`Rm${room.roomCode} Triggering delayed room teardown`);
				Lobby.triggerDelayedRoomTeardown(room);
			}
		}
	}
}

function joinRoom(user, room, rejoin, isHost = false) {
	if(rejoin) {
		room.readdUser(user);
		console.log(`Rm${room.roomCode} Rejoin: ${user.logName}`);
	} else {
		room.addUser(user, isHost);
		console.log(`Rm${room.roomCode} Join: ${user.logName}. Room users = ${room.users.length}`);
	}
	user.socket.join(room.roomCode);
	user.setGameRoom(room);
	return room;
}

const GamePrecond = {
	sockHasUser(sock) {
		if(sock.user === undefined) {
			throw new GameError('No user');
		}
	},
	sockDoesNotHaveUser(sock) {
		if(sock.user !== undefined) {
			throw new GameError('Must not have user');
		}
	},
	userIsInARoom(user) {
		if(user.gameRoom === undefined) {
			throw new GameError(`User ${user.name} should be in a room`, 'User must be in a room');
		}
	},
	userIsNotInARoom(user) {
		if(user.gameRoom !== undefined) {
			throw new GameError('User must not be in a room. User is in room ' + user.gameRoom, 'User must not be in a room');
		}
	},
	roomExists(roomCode) {
		if(Lobby.getRoomByCode(roomCode) === undefined) {
			throw new GameError(`Room-${roomCode} DNE`, 'This room is unavailable');
		}
	},
	gameInProgress(room) {
		if(!room.gameInProgress()) {
			throw new GameError('Game must be in progress');
		}
	},
	gameNotInProgress(room) {
		if(room.gameInProgress()) {
			throw new GameError('A game is already in progress');
		}
	},
	roomIsNotFull(room) {
		if(room.isFull()) {
			throw new GameError(`Room ${room.roomCode} is full`, 'This room is full');
		}
	},
	lobbyIsNotFull() {
		if(Lobby.isFull()) {
            throw new GameError('The lobby is at max capacity');
		}
	},
	isUsersTurn(user) {
		let room = user.gameRoom;
		if(room.whoseTurn() !== user) {
			throw new GameError("Not user's turn");
		}
	},
	nameIsNotTakenInRoom(username, room) {
		if(room.findUser(username)) {
			throw new GameError(`Username ${username} is taken in room ${room.roomCode}`, "This username is taken in this room");
		}
	},
	nameIsTakenInRoom(username, room) {
		if(room.findUser(username) === undefined) {
			throw new GameError(`Username ${username} DNE in room ${room.roomCode}`, "This username doesn't exist in this room");
		}
	},
};

// send roomstate update to all users
function broadcastRoomState(io, room, messageName, addtlProcessFn) {
	let state = ClientAdapter.generateStateJson(room);
	if(addtlProcessFn) {
		state = addtlProcessFn(state);
	}

	if(room.phase === GAME_PHASE.SETUP) {
		io.in(room.roomCode).emit(messageName, {
			roomState: state,
		});
		return;
    }

	for(let u of room.users) {
		let s = u.socket;
		if(u.socket === undefined) {
			continue;
		}

        let res = {
            roomState: state,
        };

		s.emit(messageName, res);
	}
}

module.exports = {
    'handleSockets': handleSockets
};
