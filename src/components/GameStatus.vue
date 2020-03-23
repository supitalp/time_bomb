<template>
    <div class="turn">
        <!-- <p>{{players[current_player_id].name}}'s turn!</p> -->
        <p>Round number: {{round_number}} / {{num_rounds}}</p>
        <p>Number of defuse found: {{this.numDefuseFound()}} / {{this.players.length}}</p>
    </div>
</template>

<script>
export default {
    name: "Turn",
    props: ["players", "cards", "current_player_id", "round_number", "num_rounds"],
    methods: {
        numDefuseFound() {
            var num_defuse_found = 0;
            for(var i = 0; i < this.cards.length; ++i) {
                if(this.cards[i].type == 1 && this.cards[i].visible) num_defuse_found++;
            }
            return num_defuse_found;
        }
    }
}
</script>

<style scoped>
    .turn {
        background: #dce2fc;
        text-align: left;
        padding: 0px;
        padding-left: 25px;
    }
</style>