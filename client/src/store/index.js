import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connected_users: []
  },
  mutations: {
    updateConnectedUsers(state, connected_users) {
      state.connected_users = connected_users;
    },
    SOCKET_USER_JOIN_ROOM(state, message) {
      state.connected_users = message;
    }
  },
  getters: {
    connected_users: state => state.connected_users
  },
  actions: {
  },
  modules: {
  }
})
