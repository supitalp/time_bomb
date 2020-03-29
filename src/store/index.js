import Vue from 'vue'
import Vuex from 'vuex'
import GAME_PHASE from '../common/game-phase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connected_users: [],
    cards: [],
    players: [],
    current_player_id: 0,
    round_number: 1,
    num_rounds: 1,
    my_username: "",
    last_card_played_id: undefined,
    game_phase: GAME_PHASE.SETUP
  },
  mutations: {
    loginUser(state, username) {
      state.my_username = username;
    },
    updateConnectedUsers(state, connected_users) {
      state.connected_users = connected_users;
    },
    SOCKET_USER_JOIN_ROOM(state, message) {
      state.connected_users = message;
    },
    SOCKET_UPDATE_GAME_STATE(state, message) {
      console.log("Updated game state!");
      state.cards = message.cards;
      state.players = message.players;
      state.current_player_id = message.current_player_id;
      state.round_number = message.round_number;
      state.num_rounds = message.num_rounds;
      state.last_card_played_id = message.last_card_played_id;
      state.game_phase = message.game_phase;
    }
  },
  getters: {
    connected_users: state => state.connected_users,
    cards: state => state.cards,
    players: state => state.players,
    current_player_id: state => state.current_player_id,
    round_number: state => state.round_number,
    num_rounds: state => state.num_rounds,
    my_username: state => state.my_username,
    last_card_played_id: state => state.last_card_played_id,
    game_phase: state => state.game_phase
  },
  actions: {
  },
  modules: {
  }
})
