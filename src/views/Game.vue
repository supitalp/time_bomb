<template>

  <div id="app">

    <EndGameModal v-show="isEndGameModalVisible"
                  :reason="reason"
                  @close="closeEndGameModal" />

    <div class="notification end-of-turn" v-show="isEndTurnNotificationVisible">
      &#9200; New round! Cards have been redistributed &#128256;
    </div>

    <div class="notification turn"
         v-show="!isEndTurnNotificationVisible"
         v-bind:class="{'my-turn':this.$store.getters.my_username == current_player_name}">
      {{current_player_name}}'s turn!
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
import MESSAGE from '../common/messages'

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
      setTimeout(() => {this.isEndTurnNotificationVisible = false;}, 5000);
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
      this.$router.replace('/');
      this.$socket.emit(MESSAGE.RESET_GAME);
    },
    findPlayerById(player_id) {
        return this.$store.getters.players.find(u => u.id == player_id);
    }
  },
  computed: {
      current_player_name: function() {
          let current_player = this.findPlayerById(this.$store.getters.current_player_id);
          return current_player.name;
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
