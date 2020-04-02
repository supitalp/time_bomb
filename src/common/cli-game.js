function generateClientGameState() {
	return {
		roomCode: undefined,
        users: [],
        hostName: undefined,
		round: undefined,
        phase: undefined,
        cards: undefined,
        currentUserId: undefined,
        lastCardPlayedId: undefined,
        numDefuseFound: undefined,
		whoseTurn: undefined,
        gameEnd: undefined,

		getUsernames() {
			return this.users.map((u) => u.name);
		},
		adoptJson(json) {
			return Object.assign(this, json);
		},
		findUser(username) {
			return this.users.find((u) => u.name === username);
		},
	};
}

module.exports = {
    generateClientGameState
}
