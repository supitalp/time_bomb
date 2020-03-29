var express = require('express')
var app = express()
var server = require('http').createServer(app)
var Socketio = require('socket.io')(server)

if(process.env.NODE_ENV !== "development") {
	app.use(express.static('dist'))
}

const port = process.env.PORT || 3000;
console.log("Listening on port :" + port);
server.listen(port);

var connected_users = [];
var cards = [];
var players = [];
var game_state = "SETUP"; // "SETUP" or "GAME"
var current_player_id = 0;
var last_card_played_id = undefined;
var num_turns_in_current_round = 0;
var player_id_started_current_round = 0;
var round_number = 1;
var num_rounds = 4;
const num_cards_per_player = 5;

// function arrayRotate(arr, reverse) {
// 	// https://stackoverflow.com/a/23368052
// 	if (reverse) arr.unshift(arr.pop());
// 	else arr.push(arr.shift());
// 	return arr;
// }

function shuffle(array) {
	// https://stackoverflow.com/a/2450976
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function createPlayers() {
	// create players
	// randomize player order
	shuffle(connected_users);
	for (var i = 0; i < connected_users.length; ++i) {
		players.push({
			id: i, socket_id: connected_users[i].socket_id, name: connected_users[i].username, team: "",
			cards: [undefined, undefined, undefined, undefined, undefined]
		});
	}

	// assign a team to each player
	assignTeams();
}

function assignTeams() {
	// Create array with available roles depending on number of players
	var num_players = players.length
	var roles_arr = [];
	if(num_players == 2) {
		// TODO: rm this debug tool (2 players normally not allowed)
		roles_arr = ["Good", "Bad"];
	}
	else if(num_players == 3) {
		// TODO: rm this debug tool (2 players normally not allowed)
		roles_arr = ["Good", "Good", "Bad"];
	}
	if (num_players == 4 || num_players == 5) {
		roles_arr = ["Good", "Good", "Good", "Bad", "Bad"];
	}
	else if (num_players == 6) {
		roles_arr = ["Good", "Good", "Good", "Good", "Bad", "Bad"];
	}
	else if (num_players == 7 || num_players == 8) {
		roles_arr = ["Good", "Good", "Good", "Good", "Good", "Bad", "Bad", "Bad"];
	}

	// Shuffle roles
	roles_arr = shuffle(roles_arr);

	// Deal one role for each player
	for (var player_idx = 0; player_idx < num_players; ++player_idx) {
		players[player_idx].team = roles_arr[player_idx];
		console.log(players[player_idx].name + ': ' + players[player_idx].team);
	}
}

function createDeck() {
	var num_players = players.length;
	console.log('Create deck for ' + num_players + ' players');

	// Find out how many cards of each type are required
	var num_bombs = 1;
	// var num_bombs = 0; // WARNING
	var num_defuse = num_players;
	var num_neutral = (num_players * num_cards_per_player - num_bombs - num_defuse);
	if (num_players < 4 || num_players > 8) {
		console.log('Error: number of players unsupported');
	}
	console.log('Num neutral: ' + num_neutral + ', num defuse: ' + num_defuse + ', num bombs: ' + num_bombs);

	// Create deck with the appropriate number of cards
	cards = [];
	for (var i = 0; i < num_neutral; ++i) cards.push({ id: i, type: 0, visible: false }); // neutral cards
	for (i = 0; i < num_defuse; ++i) cards.push({ id: i + num_neutral, type: 1, visible: false }); // defuse cards
	for (i = 0; i < num_bombs; ++i) cards.push({ id: i + num_neutral + num_defuse, type: 2, visible: false }); // bomb
}

function dealCards() {
	/*
		* Deal cards to players:
		* Take all cards that are not yet visible,
		* shuffle them,
		* and distribute them to players in such a way
		* that each player has a total of 5 cards.
		* Leave the already visible cards at their original position.
	*/

	// Build a deck with the indices of all non-visible cards [0, 1, 2, 3, ..., 20]
	var deck = []
	for (var i = 0; i < cards.length; ++i) {
		if (!cards[i].visible) {
			deck.push(i);
		}
	}
	// Shuffle deck: [7, 6, 1, ..., 13]
	deck = shuffle(deck);

	// Replace non-visible cards in players' hands with a one from the deck
	var deck_idx = 0;
	for (var player_idx = 0; player_idx < players.length; ++player_idx) {
		let player = players[player_idx];
		for(i = 0; i < players[player_idx].cards.length; ++i) {
			let card_id = player.cards[i];
			let card = cards[card_id];
			if(card === undefined || !card.visible) {
				player.cards[i] = deck[deck_idx];
				deck_idx++;
			}
		}
	}
}

// do the book keeping to make the next turn happen
// also check if the game is finished or not
// return the game status: "running", "end_round", "end_game"
function nextTurn() {
	var num_players = players.length;
	num_turns_in_current_round++;
	if(num_turns_in_current_round >= num_players) {  // one round finished
		num_turns_in_current_round = 0;

		// prepare next round: it should start from the player next to
		// the player that started the previous round
		num_turns_in_current_round = 0;
		player_id_started_current_round = (player_id_started_current_round + 1) % num_players;
		current_player_id = player_id_started_current_round;
		round_number++;

		/* rotate player order such that the first player
		is always the one starting the round
		for now, I disabled this because it causes the players to "jump" to
		their new position right after the player has clicked the card, which is weird.
		*/
		// players = arrayRotate(players);

		if(round_number > num_rounds) {
			return "end_game";
		}

		// re-deal cards to all players
		dealCards();

		return "end_round";
	}
	else {
		current_player_id = (current_player_id + 1) % num_players;
		return "running";
	}
}

function prepareNewGame() {
	createPlayers();
	createDeck();
	dealCards();
}

function updateGameState() {
	// broadcast new game state to everyone
	Socketio.emit("UPDATE_GAME_STATE", { cards: cards,
		players: players,
		current_player_id: current_player_id,
		round_number: round_number,
		num_rounds: num_rounds,
		last_card_played_id: last_card_played_id,
		game_state: game_state});
}

function numDefuseFound() {
	var num_defuse_found = 0;
	for(var i = 0; i < cards.length; ++i) {
		if(cards[i].type == 1 && cards[i].visible) num_defuse_found++;
	}
	return num_defuse_found;
}

function resetGame() {
	game_state = "SETUP";
	cards = [];
	players = [];
	current_player_id = 0;
	num_turns_in_current_round = 0;
	player_id_started_current_round = 0;
	round_number = 1;
	connected_users = [];
	last_card_played_id = undefined;
}

function endGame(reason) {
	updateGameState();
	setTimeout(() => Socketio.emit("END_GAME", reason), 400);
}

function findUser(socket_id) {
	return connected_users.find(u => u.socket_id == socket_id);
}

Socketio.on("connection", socket => {
	console.log("New connection from socket: " + socket.id);

	socket.on("USER_JOIN_ROOM", username => {
		switch(game_state) {
			case "SETUP":
				console.log("New user login: " + username + " (" + socket.id + ")");
				connected_users.push({ socket_id: socket.id, username: username });
				Socketio.emit("USER_JOIN_ROOM", connected_users);
			break;
			case "GAME":
				console.log("Ignoring: " + username + " (" + socket.id + ")"
							+ " trying to login because game is already running.");
			break;
		}
	});

	socket.on("disconnect", (reason) => {
		// Check if user was already logged in.
		// If not, we can just ignore the disconnection.
		let user = findUser(socket.id);
		if(user === undefined) {
			console.log('Ignoring socket ' + socket.id + ' disconnect because the user was not logged in');
			return;
		}

		// Otherwise, we have to notify others, and potentially hold/stop the game.
		console.log('User ' + user.username + ' (' + socket.id + ') disconnected because: ' + reason);
		// remove corresponding user from list of users
		connected_users = connected_users.filter(e => e.socket_id !== socket.id);
		console.log('Game state: ' + game_state);
		switch(game_state) {
			case "SETUP":
				// broadcast new list of users ("room state") to everyone
				Socketio.emit("USER_JOIN_ROOM", connected_users);
			break;
			case "GAME":
				endGame("user_disconnected", user.username);
			break;
		}
	});

	socket.on("RESET_GAME", () => {
		switch(game_state) {
			case "SETUP":
				console.log("Ignoring RESET_GAME request from socket: "
							+ socket.id + " because game is in SETUP state");
			break;
			case "GAME":
				resetGame();
			break;
		}
	});

	socket.on("START_GAME", () => {
		switch(game_state) {
			case "SETUP": {
				let user = findUser(socket.id);
				if(user === undefined) {
					console.log('Ignoring START_GAME request from socket ' + socket.id + ' because user is not logged in.');
					return;
				}

				console.log('User ' + user.username + ' (' + socket.id + ') is starting the game');
				game_state = "GAME";
				// prepare game: prepare deck, distribute cards to players
				prepareNewGame();
				// notify users to move to the game panel
				Socketio.emit("START_GAME");
				// send game state to all users
				updateGameState();
				break;
			}
			case "GAME":
				console.log("Ignoring START_GAME request from socket: "
							+ socket.id + " because game is already running");
			break;
		}
	});

	socket.on("SELECT_CARD", message => {
		switch(game_state) {
			case "SETUP":
				console.log("Ignoring SELECT_CARD request from socket: "
							+ socket.id + " because game is not started yet");
			break;
			case "GAME": {
				// update card that has just been made visible
				let u_card = cards.find(o => o.id === message.card.id);
				u_card.visible = true;

				console.log('User selected card: ' + message.card.id);
				last_card_played_id = message.card.id;

				if(u_card.type == 2) {
					endGame("bomb");
					return;
				}
				if(numDefuseFound() == players.length) {
					endGame("defuse_found");
					return;
				}

				// next turn: go to next player
				let game_status = nextTurn();
				if(game_status == "end_round") {
					// notify users that the round is finished (so that they may display a dialog or else)
					updateGameState();
					Socketio.emit("END_ROUND");
				}
				else if(game_status == "end_game") {
					endGame("rounds_expired");
				}
				else {
					updateGameState();
				}
				break;
			}
		}
	});
});
