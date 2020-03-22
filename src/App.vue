<template>
  <div id="app">
    <Header />
    <GameStatus :players=players
          :current_player_id=current_player_id
          :round_number=round_number
          :num_rounds=num_rounds />
    <Board :players=players
           :current_player_id=current_player_id
           v-on:next-turn="nextTurn" />
    <PlayerStatus :players=players
                  :my_player_id=my_player_id />
  </div>
</template>

<script>
import Header from './components/layout/Header'
import GameStatus from './components/GameStatus'
import Board from './components/Board'
import PlayerStatus from './components/PlayerStatus'
export default {
  name: 'App',
  components: {
    Header,
    GameStatus,
    Board,
    PlayerStatus
  },
  data() {
    return {
      players: [
        {
          id: 0,
          name: "Georges Rico",
          team: "Bad guy",
          cards: [
            {
              id: 0,
              type: 0,
              visible: false
            },
            {
              id: 1,
              type: 0,
              visible: false
            },
            {
              id: 2,
              type: 0,
              visible: false
            },
            {
              id: 13,
              type: 1,
              visible: false
            },
            {
              id: 14,
              type: 0,
              visible: false
            }
          ]
        },
        {
          id: 1,
          name: "Fuchs",
          team: "Good guy",
          cards: [
            {
              id: 3,
              type: 0,
              visible: false
            },
            {
              id: 4,
              type: 0,
              visible: false
            },
            {
              id: 5,
              type: 0,
              visible: false
            },
            {
              id: 15,
              type: 0,
              visible: false
            },
            {
              id: 16,
              type: 0,
              visible: false
            }
          ]
        },
        {
          id: 2,
          name: "Mara",
          team: "Good guy",
          cards: [
            {
              id: 6,
              type: 0,
              visible: false
            },
            {
              id: 7,
              type: 0,
              visible: false
            },
            {
              id: 8,
              type: 2,
              visible: false
            },
            {
              id: 17,
              type: 0,
              visible: false
            },
            {
              id: 18,
              type: 1,
              visible: false
            }
          ]
        },
        {
          id: 3,
          name: "Galileo",
          team: "Bad guy",
          cards: [
            {
              id: 9,
              type: 1,
              visible: false
            },
            {
              id: 10,
              type: 0,
              visible: false
            },
            {
              id: 11,
              type: 1,
              visible: false
            },
            {
              id: 12,
              type: 0,
              visible: false
            },
            {
              id: 19,
              type: 0,
              visible: false
            }
          ]
        }
      ],
      my_player_id: 2,
      current_player_id: 0,
      round_number: 1,
      num_rounds: 5
    }
  },
  methods: {
    nextTurn() {
      var num_players = 4;
      if(this.current_player_id == num_players - 1) {
        this.current_player_id = 0;
        this.round_number++;
      }
      else {
        this.current_player_id++;
      }
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
</style>
