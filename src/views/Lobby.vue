<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <form @submit.prevent="startGame" v-show="isUserHost()">
    <input type="submit" value="Start Game" class="btn" :disabled="!Boolean(canStartGame())">
    </form>
    <div class="stripe flex-center align-center game-code">
      <div class="stripe-content">
        <div id="setup-header">Your game code is:</div>
        <h1>{{ roomCode }}</h1>
      </div>
    </div>
    <h3>Players</h3>
    <p v-for="username in usernames" :key="'0' + username">{{username}}</p>
  </div>
</template>

<script>
import MESSAGE from '../common/message'
export default {
  name: "Lobby",
  sockets: {
    START_GAME: function() {
      this.$router.replace('/game');
    }
  },
  methods: {
    isUserHost() {
      return this.$store.getters.username === this.$store.getters.gameState.hostName;
    },
    startGame() {
      this.$socket.emit(MESSAGE.START_GAME, {});
    },
    canStartGame() {
        return this.numUsers >= 2 && this.numUsers <= 8;
    }
  },
  computed: {
		usernames: function() {
			return this.$store.getters.gameState && this.$store.getters.gameState.getUsernames();
    },
    numUsers: function() {
      return this.$store.getters.gameState && this.$store.getters.gameState.users.length;
    },
    roomCode: function() {
      return this.$store.getters.gameState && this.$store.getters.gameState.roomCode;
    }
	},
}
</script>

<style scoped>
    input[type="submit"] {
        padding: 15px;
        margin: 15px;
        border: 0px;
        background: #ff5454;
        color: #ffffff;
        font-size: 2vmin;
    }

    input[type="submit"]:disabled {
      background: #aaaaaa;
    }
</style>
