<template>
  <div class="join-game">
    <form @submit.prevent="joinGame">
    <input type="text" v-model="username" name="username" placeholder="My username">
    <br />
    <input type="submit" value="Join Game" class="btn" :disabled="canJoinGame()">
    </form>
  </div>
</template>

<script>

export default {
  name: "JoinGame",
  data() {
    return {
      username: ''
    }
  },
  sockets: {
  },
  methods: {
    joinGame() {
      console.log(this.username + ' joined game!');
      this.$socket.emit("USER_JOIN_ROOM", this.username);
      this.$store.commit('loginUser', this.username);
      this.$router.push('/lobby');
    },
    canJoinGame() {
      // TODO: check if username is taken
      return !this.username;
    }
  }
}
</script>

<style scoped>
    .join-game {
        padding-top: 100px;
    }

    input[type="text"] {
        background: #eeeeee;
        padding: 10px;
        border: 0px;
        border-bottom: 1px solid #ff5454;
        text-align: center;
    }

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