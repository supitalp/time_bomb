<template>
    <div>
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
        padding-top: 7px;
        padding-bottom: 7px;
    }
</style>