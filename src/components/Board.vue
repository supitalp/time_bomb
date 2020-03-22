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
    props: ["players"],
    components: {
        PlayerCards
    }
}
</script>

<style scoped>
    div {
        color: #000;
    }
</style>