<template>
    <div class="player-status">
        <p>{{my_player.name}}</p>
        <p>{{my_player.team}}</p>
        <p class="player-status-card">Neutral:
            {{numCardsOfType(my_player, cards, 0)}}</p>
        <p class="player-status-card">Defuse:
            {{numCardsOfType(my_player, cards, 1)}}</p>
        <p class="player-status-card">Bomb:
            {{numCardsOfType(my_player, cards, 2)}}</p>
    </div>
</template>

<script>
export default {
    name: "PlayerStatus",
    methods: {
        numCardsOfType(player, cards, type) {
            var num = 0;
            for(var index = 0; index < player.cards.length; ++index) {
                if(cards[player.cards[index]].type == type
                && !cards[player.cards[index]].visible) {
                    num++;
                }
            }
            return num;
        }
    },
    computed: {
        my_username: function() {
            return this.$store.getters.my_username;
        },
        my_player: function() {
            return this.$store.getters.players.find(o => o.name === this.$store.getters.my_username);
        },
        players: function() {
            return this.$store.getters.players;
        },
        cards: function() {
            return this.$store.getters.cards;
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
        margin: 20px;
    }
</style>