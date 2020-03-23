<template>
    <div>
        <div v-bind:key="player.id" v-for="player in players">
            <PlayerCards :player=player
                         :cards=cards
                         :current_player_id=current_player_id
                         v-on:next-turn="$emit('next-turn')" />
        </div>
    </div>
</template>

<script>
import PlayerCards from './PlayerCards'
export default {
    name: "Board",
    props: ["players", "cards", "current_player_id"],
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