<template>
    <div class="player-status">
        <p>{{players[my_player_id].name}}</p>
        <p>{{players[my_player_id].team}}</p>
        <p class="player-status-card">Neutral: {{numCardsOfType(players[my_player_id], 0)}}</p>
        <p class="player-status-card">Defuse: {{numCardsOfType(players[my_player_id], 1)}}</p>
        <p class="player-status-card">Bomb: {{numCardsOfType(players[my_player_id], 2)}}</p>
    </div>
</template>

<script>
export default {
    name: "PlayerStatus",
    props: ["players", "my_player_id"],
    methods: {
        numCardsOfType(player, type) {
            var num = 0;
            for(var index = 0; index < player.cards.length; ++index) {
                if(player.cards[index].type == type) {
                    num++;
                }
            }
            return num;
        }
    }
}
</script>

<style scoped>
    .player-status {
        background: #b4eec3;
    }

    .player-status-card {
        display: inline;
        margin: 10px;
    }
</style>