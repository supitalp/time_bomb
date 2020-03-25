<template>
    <div class="game-status">
        <p>{{current_player_name}}'s turn!</p>
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
    },
    computed: {
        current_player_name: function() {
            return this.$store.getters.players[this.$store.getters.current_player_id].name;
        }
    }
}
</script>

<style scoped>
    .game-status {
        width: 95%;
        background: white;
        text-align: left;
        padding: 0px;
        padding-left: 25px;
        border-bottom: 1px grey solid;
    }
</style>