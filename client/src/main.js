import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

const SocketInstance = socketio.connect('http://localhost:3000');

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketInstance,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
}));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
