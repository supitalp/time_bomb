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
      cards: [],
      players: [],
      my_player_id: 2,
      current_player_id: 0,
      round_number: 1,
      num_rounds: 4,
      num_cards_per_player: 5,
    }
  },
  methods: {
    addPlayer(id, name) {
      this.players.push({id: id, name: name, team: "", cards: []});
    },
    assignTeams() {
      // Create array with available roles depending on number of players
      var num_players = this.players.length
      var roles_arr = [];
      if(num_players == 4 || num_players == 5) {
        roles_arr = ["Good", "Good", "Good", "Bad", "Bad"];
      }
      else if(num_players == 6) {
        roles_arr = ["Good", "Good", "Good", "Good", "Bad", "Bad"];
      }
      else if(num_players == 7 || num_players == 8) {
        roles_arr = ["Good", "Good", "Good", "Good", "Good", "Bad", "Bad", "Bad"];
      }

      // Shuffle roles
      roles_arr = shuffle(roles_arr);

      // Deal one role for each player
      for(var player_idx = 0; player_idx < num_players; ++player_idx) {
        this.players[player_idx].team = roles_arr[player_idx];
        console.log(this.players[player_idx].name + ': ' + this.players[player_idx].team);
      }
    },
    createDeck() {
      var num_players = this.players.length;
      console.log('Create deck for ' + num_players + ' players');

      // Find out how many cards of each type are required
      var num_bombs = 1;
      var num_defuse = num_players;
      var num_neutral = (num_players * this.num_cards_per_player - num_bombs - num_defuse);
      if(num_players < 4 || num_players > 8) {
        console.log('Error: number of players unsupported');
      }
      console.log('Num neutral: ' + num_neutral + ', num defuse: ' + num_defuse + ', num bombs: ' + num_bombs);

      // Create deck with the appropriate number of cards
      this.cards = [];
      for(var i = 0; i < num_neutral; ++i) this.cards.push({id: i, type: 0, visible: false}); // neutral cards
      for(i = 0; i < num_defuse; ++i) this.cards.push({id: i + num_neutral, type: 1, visible: false}); // defuse cards
      for(i = 0; i < num_bombs; ++i) this.cards.push({id: i + num_neutral + num_defuse, type: 2, visible: false}); // bomb
    },
    dealCards() {
      /*
       * Deal cards to players:
       * Take all cards that are not yet visible,
       * shuffle them,
       * and distribute them to players in such a way
       * that each player has a total of 5 cards.
      */

      // Build a deck with the indices of all non-visible cards [0, 1, 2, 3, ..., 20]
      var deck = []
      for(var i = 0; i < this.cards.length; ++i) {
        if(!this.cards[i].visible) {
          deck.push(i);
        }
      }

      // Remove non-visible cards from players' hands
      for(var player_idx = 0; player_idx < this.players.length; ++player_idx) {
        var new_hand = this.players[player_idx].cards.filter(function(card_idx) { return this.cards[card_idx].visible; }, this);
        this.players[player_idx].cards = new_hand;
      }

      // Shuffle deck: [7, 6, 1, ..., 13]
      deck = shuffle(deck);

      // Deal cards to players according to how much they need each
      var global_card_idx = 0;
      for(player_idx = 0; player_idx < this.players.length; player_idx++) {
        var num_cards_for_player = this.num_cards_per_player - this.players[player_idx].cards.length;
        for(var card_idx = 0; card_idx < num_cards_for_player; ++card_idx) {
          this.players[player_idx].cards.push(deck[global_card_idx]);
          global_card_idx++;
        }
      }
    },
    nextTurn() {
      var num_players = 4;
      if(this.current_player_id == num_players - 1) {
        this.current_player_id = 0;
        this.round_number++;
        this.dealCards();
      }
      else {
        this.current_player_id++;
      }
    }
  },
  created: function() {
    this.addPlayer(0, "Georges Rico");
    this.addPlayer(1, "Fuchs");
    this.addPlayer(2, "Mara");
    this.addPlayer(3, "Galileo");
    this.assignTeams();
    this.createDeck(this.num_players);
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
