<template>
  <div class="create-game">
    <div class="warning" v-show="this.$store.getters.createWarning !== undefined">
        <p>{{this.$store.getters.createWarning}}</p>
    </div>
    <form @submit.prevent="createGame">
    <input type="text" v-model="username" name="username" placeholder="My username" required autocomplete="off">
    <div style="clear: both"></div>
    <input type="submit" value="Create Game" class="btn" :disabled="!this.$store.getters.username">
    </form>
  </div>
</template>

<script>
import MESSAGE from '../common/message'
import { validateUsername } from '../common/utils'
export default {
  name: "CreateGame",
  data() {
    return {
      'username': ""
    }
  },
  methods: {
      submitCreateGame(username) {
        const usernameWarning = 'Username must be 1-20 characters long, and can only contain alphanumerics and spaces';
        username = username.trim();
        if(validateUsername(username)) {
          this.$store.commit('setWarning', {'name': 'createWarning', 'message': undefined});
          this.$socket.emit(MESSAGE.CREATE_ROOM, {
            username: username,
          });
          return true;
        } else {
          this.$store.commit('setWarning', {'name': 'createWarning', 'message': usernameWarning});
          return false;
        }
      },
      createGame() {
        if(this.submitCreateGame(this.$store.getters.username)) {
          this.$router.replace('/lobby');
        }
      }
  },
  watch: {
    'username'(val) {
      this.$store.commit('loginUser', val);
    }
  }
}
</script>

<style scoped>
    .create-game {
        padding-top: 100px;
    }

    input[type="text"] {
        background: #eeeeee;
        padding: 10px;
        border: 0px;
        border-bottom: 1px solid #ff5454;
        text-align: center;
        font-size: 2.4vmin;
    }

    input[type="submit"] {
        padding: 7px;
        margin: 15px;
        border: 0px;
        background: #ff5454;
        color: #ffffff;
        font-size: 2.4vmin;
    }

    input[type="submit"]:disabled {
        background: #aaaaaa;
    }
</style>