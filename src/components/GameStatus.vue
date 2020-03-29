<template>
    <div class="game-status">
        <div class="game-status-item">Round: {{this.$store.getters.round_number}} / {{this.$store.getters.num_rounds}}</div>
        <div class="game-status-item">Defuse found: {{this.numDefuseFound()}} / {{this.$store.getters.players.length}}</div>
    </div>
</template>

<script>
export default {
    name: "Turn",
    methods: {
        numDefuseFound() {
            var cards = this.$store.getters.cards;
            var num_defuse_found = 0;
            for(var i = 0; i < cards.length; ++i) {
                if(cards[i].type == 1 && cards[i].visible) num_defuse_found++;
            }
            return num_defuse_found;
        }
    },
    computed: {
        num_players: function() {
            return this.$store.getters.players.length;
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