import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

var SocketInstance;
if(process.env.NODE_ENV === "development") {
  const port = process.env.PORT || 3000;
  SocketInstance = socketio('localhost:' + port);
}
else {
  SocketInstance = socketio();
}

Vue.use(new VueSocketIO({
    debug: false,
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
