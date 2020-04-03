const _ = require('lodash');
const GAME_PHASE = require('../common/game-phase.js');
const GAME_END = require('../common/game-end.js');
const MESSAGE = require('../common/message');
const TEAM = require('../common/team');
const GameError = require('./game-error.js');
const Util = require('../common/utils.js');
const CARD_TYPE = require('../common/card-type.js');
const Card = require('../common/card.js').Card;
const debugLog = require('../common/debug-log.js').debugLog;

const MIN_USERS = 2;
const MAX_USERS = 8;
const NUM_CARDS_PER_PLAYER = 5;
const NUM_ROUNDS = 4;

class GameRoom {
    constructor(roomCode, host) {
        this.roomCode = roomCode;
        this.users = [];
        this.host = host;
        this.cards = [];
        this.currentUserId = 0;
        this.lastCardPlayedId = undefined;
        this.round = 1;
        this.userIdStartedCurrentRound = 0;
        this.numTurnsInCurrentRound = 0;
        this.phase = GAME_PHASE.SETUP;
        this.gameEnd = undefined;
    }
    addUser(user, isHost = false) {
        if (this.isFull()) {
            console.warn('Full room');
        }
        this.users.push(user);
        if (isHost) {
            this.host = user;
        }
        return true;
    }
    readdUser(user) {
        let userTargetIdx = this.users.findIndex((u) => (u.name === user.name));
        if (userTargetIdx !== -1) {
            this.users[userTargetIdx] = user;
        } else {
            throw new GameError(`Could not readd ${user.logName}. Existing user target DNE.`, 'Could not rejoin');
        }
    }
    dropUser(user) {
        let idx = this.users.indexOf(user);
        this.users.splice(idx, 1);
        return this.users.length;
    }
    findUser(name) {
        return this.users.find((p) => (p.name === name));
    }
    shuffleUsers() {
        Util.shuffle(this.users);
    }
    gameInProgress() {
        return this.phase === GAME_PHASE.GAME;
    }
    isReady() {
        return this.users.length >= MIN_USERS;
    }
    isFull() {
        return this.users.length >= MAX_USERS;
    }
    isDead() {
        // all users are disconnected
        return this.users.length === 0 || _.every(this.users, u => (!u.connected));
    }
    whoseTurn() {
        return this.users[this.currentUserId];
    }
    startNewGame() {
        this.phase = GAME_PHASE.GAME;
        this.currentUserId = 0;
        this.lastCardPlayedId = undefined;
        this.round = 1;
        this.userIdStartedCurrentRound = 0;
        this.numTurnsInCurrentRound = 0;
        this.gameEnd = undefined;
        this.createPlayers();
        this.createDeck();
        this.dealCards();
    }
    createPlayers() {
        // randomize user order
        Util.shuffle(this.users);
        for (let i = 0; i < this.users.length; ++i) {
            this.users[i].cards = [undefined, undefined, undefined, undefined, undefined];
        }
        // assign a team to each user
        this.assignTeams();
    }
    assignTeams() {
        // Create array with available roles depending on number of users
        let numUsers = this.users.length
        let rolesArray = [];
        if(numUsers == 2) {
            // TODO: 2 users normally not allowed
            rolesArray = [TEAM.GOOD, TEAM.BAD];
        }
        else if(numUsers == 3) {
            // TODO: 2 users normally not allowed
            rolesArray = [TEAM.GOOD, TEAM.GOOD, TEAM.BAD];
        }
        if (numUsers == 4 || numUsers == 5) {
            rolesArray = [TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.BAD, TEAM.BAD];
        }
        else if (numUsers == 6) {
            rolesArray = [TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.BAD, TEAM.BAD];
        }
        else if (numUsers == 7 || numUsers == 8) {
            rolesArray = [TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.GOOD, TEAM.BAD, TEAM.BAD, TEAM.BAD];
        }
        // Shuffle roles
        rolesArray = Util.shuffle(rolesArray);

        // Deal one role for each user
        for (let user_id = 0; user_id < numUsers; ++user_id) {
            let user = this.users[user_id];
            user.team = rolesArray[user_id];
            debugLog(user.name + ': ' + user.team);
        }
    }
    createDeck() {
        let numUsers = this.users.length;
        debugLog('Create deck for ' + numUsers + ' users');

        // Find out how many cards of each type are required
        let numBombs = 1;
        let numDefuse = numUsers;
        let numNeutral = (numUsers * NUM_CARDS_PER_PLAYER - numBombs - numDefuse);
        if (numUsers < 4 || numUsers > 8) {
            debugLog('WARNING: number of users not officially supported');
        }
        debugLog('Num neutral: ' + numNeutral + ', num defuse: ' + numDefuse + ', num bombs: ' + numBombs);

        // Create deck with the appropriate number of cards
        this.cards = [];
        for (let i = 0; i < numNeutral; ++i) this.cards.push(new Card(i, CARD_TYPE.NEUTRAL));
        for (let i = 0; i < numDefuse; ++i) this.cards.push(new Card(i + numNeutral, CARD_TYPE.DEFUSE));
        for (let i = 0; i < numBombs; ++i) this.cards.push(new Card(i + numNeutral + numDefuse, CARD_TYPE.BOMB));
    }
    dealCards() {
        /*
            * Deal cards to users:
            * Take all cards that are not yet visible,
            * shuffle them,
            * and distribute them to users in such a way
            * that each user has a total of 5 cards.
            * Leave the already visible cards at their original position.
        */

        // Build a deck with the indices of all non-visible cards [0, 1, 2, 3, ..., 20]
        let deck = []
        for (let i = 0; i < this.cards.length; ++i) {
            if (!this.cards[i].visible) {
                deck.push(i);
            }
        }
        // Shuffle deck: [7, 6, 1, ..., 13]
        deck = Util.shuffle(deck);

        // Replace non-visible cards in users' hands with a one from the deck
        let deckId = 0;
        let numUsers = this.users.length;
        for (let userId = 0; userId < numUsers; ++userId) {
            let user = this.users[userId];
            for(let i = 0; i < user.cards.length; ++i) {
                let cardId = user.cards[i];
                let card = this.cards[cardId];
                if(card === undefined || !card.visible) {
                    user.cards[i] = deck[deckId];
                    deckId++;
                }
            }
        }
    }
    uncoverCard(card_id) {
        let card = this.cards.find(card => card.id === card_id);
        card.visible = true;
        this.lastCardPlayedId = card_id;
        if(this.cards[card_id].type === CARD_TYPE.BOMB) {
            this.gameEnd = GAME_END.BOMB_EXPLODED;
        }
        if(this.numDefuseFound() == this.users.length) {
            this.gameEnd = GAME_END.ALL_DEFUSE_FOUND;
        }
    }
    nextTurn() {
        /* do the book keeping to make the next turn happen
         * also check if the game is finished or not
         *return the game status: "running", "end_round", "end_game"
        */
        let numUsers = this.users.length;
        this.numTurnsInCurrentRound++;
        if(this.numTurnsInCurrentRound >= numUsers) {  // one round finished
            // prepare next round: it should start from the user next to
            // the user that started the previous round
            this.numTurnsInCurrentRound = 0;
            this.userIdStartedCurrentRound = (this.userIdStartedCurrentRound + 1) % numUsers;
            this.currentUserId = this.userIdStartedCurrentRound;
            this.round++;

            if(this.round > NUM_ROUNDS) {
                this.gameEnd = GAME_END.TIME_EXPIRED;
                return MESSAGE.END_GAME;
            }

            // re-deal cards to all users
            this.dealCards();

            return MESSAGE.NEW_ROUND;
        }
        else {
            this.currentUserId = (this.currentUserId + 1) % numUsers;
            return MESSAGE.NEW_TURN;
        }
    }
    numDefuseFound() {
        let numDefuseFound = 0;
        for(let i = 0; i < this.cards.length; ++i) {
            if(this.cards[i].type === CARD_TYPE.DEFUSE && this.cards[i].visible) {
                numDefuseFound++;
            }
        }
        return numDefuseFound;
    }
}

const ClientAdapter = {
	generateStateJson(gameRoom) {
		let res = {
			roomCode: gameRoom.roomCode,
			users: _.map(gameRoom.users, (u) => ({
                name: u.name,
                team: u.team,
                connected: u.connected,
                cards: u.cards
            })),
            hostName: gameRoom.host.name,
			round: gameRoom.round,
			phase: gameRoom.phase,
            cards: gameRoom.cards,
            currentUserId: gameRoom.currentUserId,
            lastCardPlayedId: gameRoom.lastCardPlayedId ? gameRoom.lastCardPlayedId : null,
            numDefuseFound: gameRoom.numDefuseFound(),
            whoseTurn: gameRoom.whoseTurn() ? gameRoom.whoseTurn().name : null, // null, so the empty value still gets passed to the client
            gameEnd: gameRoom.gameEnd
		};
		return res;
	}
};

module.exports = {
    'GameRoom': GameRoom,
    'ClientAdapter': ClientAdapter
};
