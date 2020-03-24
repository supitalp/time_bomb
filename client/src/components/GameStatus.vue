<template>
    <div class="game-status">
        <!-- <p>{{players[current_player_id].name}}'s turn!</p> -->
        <p>Round number: {{this.$store.getters.round_number}} / {{this.$store.getters.num_rounds}}</p>
        <p>Number of defuse found: {{this.numDefuseFound()}} / {{this.$store.getters.players.length}}</p>
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
    }
}
</script>

<style scoped>
    .game-status {
        background: #dce2fc;
        text-align: left;
        padding: 0px;
        padding-left: 25px;
    }
</style>