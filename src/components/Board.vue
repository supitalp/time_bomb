<template>
    <div class="board">
        <div v-bind:key="player.id" v-for="player in players">
            <PlayerCards v-bind:player="player" />
        </div>
    </div>
</template>

<script>
import PlayerCards from './PlayerCards'
export default {
    name: "Board",
    components: {
        PlayerCards
    },
    computed: {
        players: function() {
            return this.$store.getters.players;
        }
    }
}
</script>

<style scoped>
    div {
        padding-bottom: 0.4vmax;
        padding-top: 0.4vmax;
    }

    .board {
        padding-bottom: 2.5vmax;
    }

</style>