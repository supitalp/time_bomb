<template>
    <div class="board">
        <div v-bind:key="user.name" v-for="user in users">
            <PlayerCards :user="user" />
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
        users: function() {
            return this.$store.getters.gameState.users;
        }
    }
}
</script>

<style scoped>
    div {
        padding-bottom: 0.4vh;
        padding-top: 0.4vh;
    }

    .board {
        padding-bottom: 2.5vh;
    }

</style>