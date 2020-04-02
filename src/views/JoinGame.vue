<template>
  <div class="join-game">
    <div class="warning" v-show="this.$store.getters.joinWarning !== undefined">
        <p>{{this.$store.getters.joinWarning}}</p>
    </div>
    <form @submit.prevent="joinGame">
    <input type="text" v-model="username" name="username" placeholder="My username" required autocomplete="off">
    <div style="clear: both"></div>
    <input type="text" v-model="roomCode" name="roomCode" placeholder="Room Code" required autocomplete="off">
    <br />
    <input type="submit" value="Join Game" class="btn" :disabled="canJoinGame()">
    </form>
  </div>
</template>

<script>
import MESSAGE from '../common/message'
import { validateUsername } from '../common/utils'
export default {
  name: "JoinGame",
  data() {
    return {
      'username': "",
      'roomCode': ""
    }
  },
  methods: {
    submitJoinGame(roomCode, username) {
      const usernameWarning = 'Username must be 1-20 characters long, and can only contain alphanumerics and spaces';
      username = username.trim();
      if(validateUsername(username)) {
        this.$store.commit('setWarning', {'name': 'joinWarning', 'message': undefined});
        this.$socket.emit(MESSAGE.JOIN_ROOM, {
          roomCode: roomCode,
          username: username,
        });
        return true;
      } else {
        this.$store.commit('setWarning', {'name': 'createWarning', 'message': usernameWarning});
        return false;
      }
    },
    joinGame() {
      if(this.submitJoinGame(this.$store.getters.roomCode, this.$store.getters.username)) {
        this.$router.replace('/lobby');
      }
      // console.log(this.$store.getters.username + ' joined game!');
      // this.$socket.emit(MESSAGE.JOIN_ROOM, this.$store.getters.username);
      // this.$router.replace('/lobby');
    },
    canJoinGame() {
      return !this.$store.getters.username || !this.$store.getters.roomCode;
    }
  },
  watch: {
    'username'(val) {
      this.$store.commit('loginUser', val);
    },
    'roomCode'(val) {
      this.$store.commit('updateRoomCode', val);
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
        margin: 7px;
        border: 0px;
        border-bottom: 1px solid #ff5454;
        text-align: center;
        font-size: 2.4vmin;
    }

    input[type="submit"] {
        padding: 7px;
        margin: 7px;
        border: 0px;
        background: #ff5454;
        color: #ffffff;
        font-size: 2.4vmin;
    }

    input[type="submit"]:disabled {
        background: #aaaaaa;
    }
</style>