<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <form @submit.prevent="startGame">
    <input type="submit" value="Start Game" class="btn" :disabled="!Boolean(canStartGame())">
    </form>
    <h3>Players</h3>
    <p v-for="user in this.$store.getters.connected_users" :key="user.id">
        {{user.username}}
    </p>
  </div>
</template>

<script>
import MESSAGE from '../common/messages'
export default {
  name: "Lobby",
  sockets: {
    START_GAME: function() {
      this.$router.push('/game');
    }
  },
  methods: {
    startGame() {
      this.$socket.emit(MESSAGE.START_GAME);
    },
    canStartGame() {
      var num_players = this.$store.getters.connected_users.length;
      // return num_players >= 4 && num_players <= 8;
        return num_players >= 2 && num_players <= 8;
    }
  }
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
