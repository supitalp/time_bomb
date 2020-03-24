const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var connected_users = [];
var cards = [];
var players = [];
var my_player_id = 0;
var current_player_id = 0;
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
		players.push({ id: i, socket_id: connected_users[i].id, name: connected_users[i].username, team: "", cards: [] });
	}

	// assign a team to each player
	assignTeams();
}

function assignTeams() {
	// Create array with available roles depending on number of players
	var num_players = players.length
	var roles_arr = [];
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
	*/

	// Build a deck with the indices of all non-visible cards [0, 1, 2, 3, ..., 20]
	var deck = []
	for (var i = 0; i < cards.length; ++i) {
		if (!cards[i].visible) {
			deck.push(i);
		}
	}

	// Remove non-visible cards from players' hands
	for (var player_idx = 0; player_idx < players.length; ++player_idx) {
		var new_hand = players[player_idx].cards.filter(function (card_idx) { return cards[card_idx].visible; });
		players[player_idx].cards = new_hand;
	}

	// Shuffle deck: [7, 6, 1, ..., 13]
	deck = shuffle(deck);

	// Deal cards to players according to how much they need each
	var global_card_idx = 0;
	for (player_idx = 0; player_idx < players.length; player_idx++) {
		var num_cards_for_player = num_cards_per_player - players[player_idx].cards.length;
		for (var card_idx = 0; card_idx < num_cards_for_player; ++card_idx) {
			players[player_idx].cards.push(deck[global_card_idx]);
			global_card_idx++;
		}
	}
}

function nextTurn() {
	var num_players = players.length;
	if (current_player_id == num_players - 1) {
		current_player_id = 0;
		round_number++;
		dealCards();
	}
	else {
		current_player_id++;
	}
}

function prepareNewGame() {
	createPlayers();
	createDeck();
	dealCards();

	console.log(cards);
	console.log(players);
}

function updateGameState() {
	// broadcast new game state to everyone
	Socketio.emit("UPDATE_GAME_STATE", { cards: cards,
		players: players,
		current_player_id: current_player_id,
		round_number: round_number,
		num_rounds: num_rounds});
}

Socketio.on("connection", socket => {
	console.log("New connection from socket: " + socket.id);

	socket.on("USER_JOIN_ROOM", username => {
		console.log("New user login: " + username);
		connected_users.push({ id: socket.id, username: username });
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

		// prepare game: prepare deck, distribute cards to players
		prepareNewGame();

		Socketio.emit("START_GAME"); // notify clients to move to the game panel

		updateGameState();
	});

	socket.on("SELECT_CARD", message => {
		// update card that has just been made visible
		u_card = cards.find(o => o.id === message.card.id);
		u_card.visible = true;

		// next turn: go to next player
		nextTurn();

		updateGameState();
	});
});