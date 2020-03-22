<template>
    <div class="player-status">
        <p>{{players[0].name}}</p>
        <p>{{players[0].team}}</p>
        <p class="player-status-card">Neutral: {{numCardsOfType(players[0], 0)}}</p>
        <p class="player-status-card">Defuse: {{numCardsOfType(players[0], 1)}}</p>
        <p class="player-status-card">Bomb: {{numCardsOfType(players[0], 2)}}</p>
    </div>
</template>

<script>
export default {
    name: "PlayerStatus",
    props: ["players"],
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
        background: #dddddd;
    }

    .player-status-card {
        display: inline;
        margin: 10px;
    }
</style>