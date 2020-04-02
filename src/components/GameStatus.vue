<template>
    <div class="game-status">
        <div class="game-status-item">Round: {{this.$store.getters.gameState.round}} / 4</div>
        <div class="game-status-item">Defuse found: {{this.$store.getters.gameState.numDefuseFound}} / {{numUsers}}</div>
    </div>
</template>

<script>
export default {
    name: "Turn",
    computed: {
        numUsers: function() {
            return this.$store.getters.gameState && this.$store.getters.gameState.users.length;
        }
    }
}
</script>

<style scoped>
    .game-status {
        width: 95%;
        margin: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: white;
    }

    .game-status-item {
        flex: 1;
        padding: 5px;
        border-bottom: 1px grey solid;
    }

</style>