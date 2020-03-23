<template>
  <div class="join-game">
    <form @submit="joinGame">
    <input type="text" v-model="username" name="username" placeholder="My username">
    <br />
    <input type="submit" value="Join Game" class="btn">
    </form>
  </div>
</template>

<script>
import io from "socket.io-client"
export default {
  name: "JoinGame",
  data() {
    return {
      socket: {},
      username: ''
    }
  },
  methods: {
    joinGame(e) {
      e.preventDefault();
      console.log(this.username + ' joined game!');
      // here, should notify server that I joined the game
      this.$router.push('/lobby');
      this.username = ''
    }
  },
  created: function() {
      this.socket = io("http://localhost:3000");
  },
  mounted: function() {
      this.socket.on("new-user", data => {
          console.log(data);
      });
  }
}
</script>

<style scoped>
    .join-game {
        padding: 100px;
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
</style>