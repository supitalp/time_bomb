<template>

  <div id="app">

    <EndGameModal v-show="isEndGameModalVisible"
                  @close="closeEndGameModal" />

    <div class="notification end-of-turn" v-show="isEndTurnNotificationVisible">
      &#9200; New round! Cards have been redistributed &#128256;
    </div>

    <div class="notification turn"
         v-show="!isEndTurnNotificationVisible"
         v-bind:class="{'my-turn':this.$store.getters.username == this.$store.getters.gameState.whoseTurn}">
      {{this.$store.getters.gameState.whoseTurn}}'s turn!
    </div>

    <GameStatus />
    <Board />
    <PlayerStatus />
  </div>
</template>

<script>
import GameStatus from '../components/GameStatus'
import Board from '../components/Board'
import PlayerStatus from '../components/PlayerStatus'
import EndGameModal from '../components/EndGameModal';
import MESSAGE from '../common/message'

export default {
  name: 'Game',
  components: {
    GameStatus,
    Board,
    PlayerStatus,
    EndGameModal
  },
  sockets: {
    NEW_ROUND: function() {
      this.isEndTurnNotificationVisible = true;
      setTimeout(() => {this.isEndTurnNotificationVisible = false;}, 5000);
    },
    END_GAME: function() {
      this.showEndGameModal();
    }
  },
  data () {
    return {
      isEndGameModalVisible: false,
      isEndTurnNotificationVisible: false,
    };
  },
  methods: {
    showEndGameModal() {
      this.isEndGameModalVisible = true;
    },
    closeEndGameModal() {
      this.isEndGameModalVisible = false;
      // when user closes this modal, we leave the room
      // and go back to the main page
      this.$socket.emit(MESSAGE.LEAVE_ROOM);
      this.$router.replace('/');
    }
  }
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

.notification {
  width: 100%;
  margin: auto;
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 6px;
  font-weight: bold;
}

.turn {
  background: rgb(255, 193, 79);
}

.end-of-turn {
  background-color: rgba(150, 223, 241, 1.0);
}

.my-turn {
  background: lightgreen;
}

</style>
