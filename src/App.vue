<template>
  <div id="app">
    <Header />
    <GameStatus :players=players
          :cards=cards
          :current_player_id=current_player_id
          :round_number=round_number
          :num_rounds=num_rounds />
    <Board :players=players
           :cards=cards
           :current_player_id=current_player_id
           v-on:next-turn="nextTurn" />
    <PlayerStatus :players=players
                  :cards=cards
                  :my_player_id=my_player_id />
  </div>
</template>

<script>
import Header from './components/layout/Header'
import GameStatus from './components/GameStatus'
import Board from './components/Board'
import PlayerStatus from './components/PlayerStatus'

function shuffle(array) {
  // https://stackoverflow.com/a/2450976
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

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
              type: 0,
              visible: false
            },
            {
              id: 9,
              type: 0,
              visible: false
            },
            {
              id: 10,
              type: 0,
              visible: false
            },
            {
              id: 11,
              type: 0,
              visible: false
            },
            {
              id: 12,
              type: 0,
              visible: false
            },
            {
              id: 13,
              type: 0,
              visible: false
            },
            {
              id: 14,
              type: 0,
              visible: false
            },
            {
              id: 15,
              type: 1,
              visible: false
            },
            {
              id: 16,
              type: 1,
              visible: false
            },
            {
              id: 17,
              type: 1,
              visible: false
            },
            {
              id: 18,
              type: 1,
              visible: false
            },
            {
              id: 19,
              type: 2,
              visible: false
            }
      ],
      players: [
        {
          id: 0,
          name: "Georges Rico",
          team: "Bad guy",
          cards: []
        },
        {
          id: 1,
          name: "Fuchs",
          team: "Good guy",
          cards: []
        },
        {
          id: 2,
          name: "Mara",
          team: "Good guy",
          cards: []
        },
        {
          id: 3,
          name: "Galileo",
          team: "Bad guy",
          cards: []
        }
      ],
      my_player_id: 2,
      current_player_id: 0,
      round_number: 1,
      num_rounds: 5
    }
  },
  methods: {
    dealCards() {
      // make an array with card indices: [0, 1, 2, 3, ..., 20]
      var all_cards = []
      for(var i = 0; i < 20; ++i) {
        all_cards[i] = i;
      }
      // shuffle array: [7, 6, 1, ..., 13]
      all_cards = shuffle(all_cards);
      console.log(all_cards);

      // deal cards to players
      var num_cards_per_player = 5;
      var global_card_idx = 0;
      for(var card_idx = 0; card_idx < num_cards_per_player; ++card_idx) {
        for(var player_idx = 0; player_idx < this.players.length; player_idx++) {
          this.players[player_idx].cards.push(all_cards[global_card_idx]);
          console.log(all_cards[global_card_idx]);
          global_card_idx++;
        }
      }
    },
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
  },
  created: function() {
    this.dealCards();
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
