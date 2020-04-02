<template>
  <div class="setup">
    <Header />
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
    <Footer />
  </div>
</template>

<script>
import MESSAGE from '../common/message'
import { validateUsername } from '../common/utils'
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
export default {
  name: "CreateGame",
  components: {
    Header,
    Footer
  },
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
</style>