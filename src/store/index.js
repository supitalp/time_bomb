import Vue from 'vue'
import Vuex from 'vuex'
import CONNECTION_STATE from '../common/connection-state'
import { generateClientGameState } from '../common/cli-game'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: localStorage.username || '',
    roomCode: undefined,
    gameState: undefined,
    createWarning: undefined,
    joinWarning: undefined,
    gameConnection: CONNECTION_STATE.DISCONNECT
  },
  mutations: {
    setGameState(state, newGameState) {
      if(newGameState === undefined) {
        state.gameState = undefined;
        this.commit('setGameConnection', CONNECTION_STATE.DISCONNECT);
        return;
      }
      this.commit('setGameConnection', CONNECTION_STATE.CONNECT);

      if(state.gameState === undefined) {
        state.gameState = generateClientGameState();
      }
      state.gameState.adoptJson(newGameState);
    },
    setUsername(state, username) {
      state.username = username;
      localStorage.username = username;
    },
    setGameConnection(state, cs) {
      state.gameConnection = cs;
    },
    setWarning(state, warning) {
      state[warning.name] = warning.message;
    },
    updateRoomCode(state, roomCode) {
      state.roomCode = roomCode;
    },
    SOCKET_CREATE_ROOM(state, data) {
      if(data.err) {
        this.commit('setWarning', {name: 'createWarning', message: data.err});
        console.warn(data.err);
        return;
      }
      state.username = data.username;
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_JOIN_ROOM(state, data) {
      if(data.err) {
        this.commit('setWarning', {name: 'joinWarning', message: data.err});
        console.warn(data.err);
        return;
      }
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_START_GAME(state, data) {
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_NEW_TURN(state, data) {
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_NEW_ROUND(state, data) {
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_END_GAME(state, data) {
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    },
    SOCKET_USER_LEFT(state, data) {
      if(data.roomState !== undefined) {
        this.commit('setGameState', data.roomState);
      }
    }
  },
  getters: {
    username: state => state.username,
    gameState: state => state.gameState,
    roomCode: state => state.roomCode,
    createWarning: state => state.createWarning,
    joinWarning: state => state.joinWarning
  },
  actions: {
  },
  modules: {
  }
})
