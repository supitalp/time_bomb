<template>
  <div class="setup">
    <Header />
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
    <Footer />
  </div>
</template>

<script>
import MESSAGE from '../common/message'
import { validateUsername } from '../common/utils'
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
export default {
  name: "JoinGame",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      'username': "",
      'roomCode': ""
    }
  },
  sockets: {
    JOIN_ROOM: function(data) {
      if(!data.err) {
        // do not move to lobby if there was an error when joining (i.e. when room is unavailable)
        this.$router.replace('/lobby');
      }
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
      this.submitJoinGame(this.$store.getters.roomCode, this.$store.getters.username);
    },
    canJoinGame() {
      return !this.$store.getters.username || !this.$store.getters.roomCode;
    }
  },
  watch: {
    'username'(val) {
      this.$store.commit('setUsername', val);
    },
    'roomCode'(val) {
      this.$store.commit('updateRoomCode', val);
    }
  }
}
</script>

<style scoped>
</style>
