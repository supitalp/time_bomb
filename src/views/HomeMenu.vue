<template>
  <div class="home-menu">
    <button class="btn big primary" @click="gotoCreateGame()">New Game</button>
    <div style="clear: both"></div>
    <button class="btn big primary" @click="gotoJoinGame()">Join Game</button>
  </div>
</template>

<script>
export default {
  name: "HomeMenu",
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
    .home-menu {
        padding-top: 100px;
    }

    .btn {
        padding: 10px;
        margin: 15px;
        border: 0px;
        background: #ff5454;
        color: #ffffff;
        font-size: 2.4vmin;
    }

</style>