<template>

  <div id="app">

    <EndRoundModal v-show="isEndRoundModalVisible" />
    <EndGameModal v-show="isEndGameModalVisible"
                  :reason="reason"
                  @close="closeEndGameModal" />

    <GameStatus />
    <Board />
    <PlayerStatus />
  </div>
</template>

<script>
import GameStatus from '../components/GameStatus'
import Board from '../components/Board'
import PlayerStatus from '../components/PlayerStatus'
import EndRoundModal from '../components/EndRoundModal';
import EndGameModal from '../components/EndGameModal';

export default {
  name: 'Game',
  components: {
    GameStatus,
    Board,
    PlayerStatus,
    EndRoundModal,
    EndGameModal
  },
  sockets: {
    END_ROUND: function() {
      console.log("End round triggered");
      this.showEndRoundModal();
      setTimeout(() => this.closeEndRoundModal(), 3000);
    },
    END_GAME: function(reason) {
      this.reason = reason;
      console.log("Game has ended because: " + reason);
      this.showEndGameModal();
    }
  },
  data () {
    return {
      isEndRoundModalVisible: false,
      isEndGameModalVisible: false,
      reason: ''
    };
  },
  methods: {
    showEndRoundModal() {
      this.isEndRoundModalVisible = true;
    },
    closeEndRoundModal() {
      this.isEndRoundModalVisible = false;
    },
    showEndGameModal() {
      this.isEndGameModalVisible = true;
    },
    closeEndGameModal() {
      this.isEndGameModalVisible = false;
      // when user closes this modal, we should reset the game
      // and go back to the main page...
      this.$router.push('/');
      this.$socket.emit("RESET_GAME");
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
