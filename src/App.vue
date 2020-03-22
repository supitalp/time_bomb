<template>
  <div id="app">
    <Header />
    <Turn v-bind:players="players" />
    <Board v-bind:players="players" />
    <PlayerStatus v-bind:players="players" />
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
            },
            {
              id: 1,
              type: 0,
            },
            {
              id: 2,
              type: 0,
            },
            {
              id: 13,
              type: 1,
            },
            {
              id: 14,
              type: 0,
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
            },
            {
              id: 4,
              type: 0,
            },
            {
              id: 5,
              type: 0,
            },
            {
              id: 15,
              type: 0,
            },
            {
              id: 16,
              type: 0,
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
            },
            {
              id: 7,
              type: 0,
            },
            {
              id: 8,
              type: 2,
            },
            {
              id: 17,
              type: 0,
            },
            {
              id: 18,
              type: 1,
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
            },
            {
              id: 10,
              type: 0,
            },
            {
              id: 11,
              type: 1,
            },
            {
              id: 12,
              type: 0,
            },
            {
              id: 19,
              type: 0,
            }
          ]
        }
      ]
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
