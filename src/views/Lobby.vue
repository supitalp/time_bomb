<template>
  <div class="setup">
    <div class="game-code">
      <p>Your game code is:</p>
      <h1>{{ roomCode }}</h1>
    </div>
    <div class="players">
      <p>Players:</p>
      <ul class="userlist" >
        <li v-for="username in usernames" :key="'0' + username">{{username}}</li>
      </ul>
    </div>
    <form class="start-game" @submit.prevent="startGame">
      <input type="submit" value="Start Game" class="btn" :disabled="!Boolean(canStartGame())">
    </form>
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
  }
}
</script>

<style scoped>

  .setup {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
  }

  .game-code {
    flex: 1;
    margin-bottom: 40px;
  }

  .players {
    flex: 1;
  }

  .start-game {
    flex: 1;
  }

  .userlist{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc((20px) * 12);
  }

  ul {
    list-style-type: none;
    padding: 0px;
  }

  h1 {
    display: inline;
    font-size: 42px;
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif
  }

  li {
    font-size: 17px;
    font-weight: bold;
    padding: 2px;
  }

  p {
    flex: 1;
    margin: 5px;
    font-size: 18px;
  }

  @media only screen and (max-width: 600px) {
      .setup {
        padding-top: 75px;
      }
      .userlist {
        height: calc((16px) * 12);
      }
  }

</style>
