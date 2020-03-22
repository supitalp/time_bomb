<template>
  <div id="app">
    <Header />
    <Turn />
    <Board />
    <PlayerStatus />
  </div>
</template>

<script>
import Header from './components/layout/Header'
import Turn from './components/Turn'
import Board from './components/Board'
import PlayerStatus from './components/PlayerStatus'
export default {
  name: 'App',
  components: {
    Header,
    Turn,
    Board,
    PlayerStatus
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
