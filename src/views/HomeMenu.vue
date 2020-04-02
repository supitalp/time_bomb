<template>
  <div class="setup">
      <Header />
      <div class="home-menu">
        <button class="btn" @click="gotoCreateGame()">New Game</button>
        <div style="clear: both"></div>
        <button class="btn" @click="gotoJoinGame()">Join Game</button>
      </div>
      <Footer />
  </div>
</template>

<script>
import Header from '../components/layout/Header.vue';
import Footer from '../components/layout/Footer.vue';
export default {
  name: "HomeMenu",
  components: {
    Header,
    Footer
  },
  methods: {
    gotoCreateGame() {
        this.$router.replace('/create-game');
    },
    gotoJoinGame() {
        this.$router.replace('/join-game');
    }
  }
}
</script>

<style scoped>
</style>