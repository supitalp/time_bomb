<template>

  <div id="app">

    <EndGameModal v-show="isEndGameModalVisible"
                  :reason="reason"
                  @close="closeEndGameModal" />

    <div class="turn-notification"
         v-bind:class="{'my-turn':this.$store.getters.my_username == current_player_name}">
      {{current_player_name}}'s turn!
    </div>

    <div class="end-of-turn-notification" v-show="isEndTurnNotificationVisible">
      &#9200; New turn! Cards have been redistributed &#128256;
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

export default {
  name: 'Game',
  components: {
    GameStatus,
    Board,
    PlayerStatus,
    EndGameModal
  },
  sockets: {
    END_ROUND: function() {
      console.log("End round triggered");
      this.isEndTurnNotificationVisible = true;
      setTimeout(() => {this.isEndTurnNotificationVisible = false;}, 2500);
    },
    END_GAME: function(reason) {
      this.reason = reason;
      console.log("Game has ended because: " + reason);
      this.showEndGameModal();
    }
  },
  data () {
    return {
      isEndGameModalVisible: false,
      isEndTurnNotificationVisible: false,
      reason: ''
    };
  },
  methods: {
    showEndGameModal() {
      this.isEndGameModalVisible = true;
    },
    closeEndGameModal() {
      this.isEndGameModalVisible = false;
      // when user closes this modal, we should reset the game
      // and go back to the main page...
      this.$router.push('/');
      this.$socket.emit("RESET_GAME");
    },
    myTurn() {
      return this.$store.getters.players[this.$store.getters.current_player_id].name === this.$store.getters.my_username;
    }
  },
  computed: {
      current_player_name: function() {
          return this.$store.getters.players[this.$store.getters.current_player_id].name;
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

.turn-notification {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 5;
  background: orange;
  padding: 6px;
  font-weight: bold;
}

.end-of-turn-notification {
  width: 100%;
  margin: auto;
  /* position: sticky; */
  z-index: 5;
  background-color: rgba(150, 223, 241, 0.3);
  padding: 6px;
  font-weight: bold;
}

.my-turn {
  background: lightgreen;
}

</style>
