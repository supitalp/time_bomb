<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <h3>Players</h3>
    <form @submit="startGame">
    <input type="submit" value="Start Game" class="btn" :disabled="!Boolean(canStartGame())">
    </form>
    <p v-for="user in this.$store.getters.connected_users" :key="user.id">
        {{user.username}}
    </p>
  </div>
</template>

<script>
export default {
  name: "Lobby",
  sockets: {
    START_GAME: function() {
      this.$router.push('/game');
    }
  },
  methods: {
    startGame() {
      this.$socket.emit("START_GAME");
    },
    canStartGame() {
      var num_players = this.$store.getters.connected_users.length;
      return num_players >= 4 && num_players <= 8;
    }
  }
}
</script>

<style scoped>
    input[type="submit"] {
        padding: 7px;
        margin: 15px;
        border: 0px;
        background: #ff5454;
        color: #ffffff;
    }

    input[type="submit"]:disabled {
      background: #aaaaaa;
    }
</style>
