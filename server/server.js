const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var connected_users = [];
var cards = [];
var players = [];
var current_player_id = 0;
var num_turns_in_current_round = 0;
var player_id_started_current_round = 0;
var round_number = 1;
var num_rounds = 4;
const num_cards_per_player = 5;

Http.listen(3000, () => {
	console.log("Listening at :3000...");
});

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
	for (var i = 0; i < connected_users.length; ++i) {
		players.push({ id: i, socket_id: connected_users[i].id, name: connected_users[i].username, team: "",
					   cards: [undefined, undefined, undefined, undefined, undefined] });
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
		// console.log("Before reshuffle: ");
		// console.log(player.cards);
		for(i = 0; i < players[player_idx].cards.length; ++i) {
			let card_id = player.cards[i];
			let card = cards[card_id];
			if(card === undefined || !card.visible) {
				player.cards[i] = deck[deck_idx];
				deck_idx++;
			}
		}
		// console.log("After reshuffle: ");
		// console.log(player.cards);
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
		num_rounds: num_rounds});
}

function numDefuseFound() {
	var num_defuse_found = 0;
	for(var i = 0; i < cards.length; ++i) {
		if(cards[i].type == 1 && cards[i].visible) num_defuse_found++;
	}
	return num_defuse_found;
}

function resetGame() {
	cards = [];
	players = [];
	current_player_id = 0;
	num_turns_in_current_round = 0;
	player_id_started_current_round = 0;
	round_number = 1;
	connected_users = [];
}

function endGame(reason) {
	updateGameState();
	setTimeout(() => Socketio.emit("END_GAME", reason), 750);
}

Socketio.on("connection", socket => {
	console.log("New connection from socket: " + socket.id);

	socket.on("USER_JOIN_ROOM", username => {
		console.log("New user login: " + username + " (" + socket.id + ")");
		connected_users.push({ id: socket.id, username: username });
		Socketio.emit("USER_JOIN_ROOM", connected_users);
	});

	socket.on("disconnect", (reason) => {
		console.log('User ' + socket.id + ' disconnected because: ' + reason);
		// remove corresponding user from list of users
		connected_users = connected_users.filter(e => e.id !== socket.id);
		// broadcast new list of users ("room state") to everyone
		Socketio.emit("USER_JOIN_ROOM", connected_users);
	});

	socket.on("RESET_GAME", () => {
		resetGame();
	});

	socket.on("START_GAME", () => {
		console.log('User ' + socket.id + ' asked to start game');

		// prepare game: prepare deck, distribute cards to players
		prepareNewGame();

		console.log('Notify client on START_GAME');
		Socketio.emit("START_GAME"); // notify clients to move to the game panel

		updateGameState();
	});

	socket.on("SELECT_CARD", message => {
		// update card that has just been made visible
		u_card = cards.find(o => o.id === message.card.id);
		u_card.visible = true;

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
			setTimeout(() => Socketio.emit("END_ROUND"), 150);
		}
		else if(game_status == "end_game") {
			endGame("rounds_expired");
		}
		else {
			updateGameState();
		}
	});
});

function checkGame() {
	// Check that all cards are present exactly once in players' hands
	// Used for tests
	var arr = [];
	for(var i = 0; i < cards.length; ++i) {
		arr[i] = 0;
	}
	for (var player_idx = 0; player_idx < players.length; ++player_idx) {
		let player = players[player_idx];
		for(i = 0; i < players[player_idx].cards.length; ++i) {
			let card_id = player.cards[i];
			arr[card_id]++;
		}
	}
	console.log(arr);
}
