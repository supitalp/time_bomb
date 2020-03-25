<template>
    <div class="player-status">
        <div class="player-identity">
            <p>{{my_player.name}}</p>
            <img class="card_preview" :src="getTeamImgUrl(my_player.team)" />
        </div>
        <div class="player-cards-row">
            <p>My hidden cards</p>
            <div class="player-cards">
                <img v-for="index in numCardsOfType(my_player, cards, 0)" :key="index" class="card_preview" :src="getImgUrl(0)" />
                <img v-for="index in numCardsOfType(my_player, cards, 1)" :key="index" class="card_preview" :src="getImgUrl(1)" />
                <img v-for="index in numCardsOfType(my_player, cards, 2)" :key="index" class="card_preview" :src="getImgUrl(2)" />
            </div>
        </div>
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
        },
        getTeamImgUrl(team) {
            var images = require.context('../../assets/cards/original');
            if(team === "Good") {
                return images('./' + 'good_guy_1.png');
            }
            else {
                return images('./' + 'bad_guy_1.png');
            }
        },
        getImgUrl(type) {
            var images = require.context('../../assets/cards/original');
            if(type == 0) {
                return images('./' + 'neutral.png');
            }
            else if(type == 1) {
                return images('./' + 'defuse.png');
            }
            else {
                return images('./' + 'bomb.png');
            }
        },
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
        width: 95%;
        margin: auto;
        display: flex;
        flex-direction: row;

        background: #ffffff;
        border-top: 1px grey solid;
    }

    .player-identity {
        flex: 1;
    }

    .player-cards-row {
        flex: 3;
    }

    img.card_preview {
        width: 90%;
        max-width: 100px;
        padding-left: 0.5%;
        padding-right: 0.5%;
    }

    p {
        color: #444444;
    }

</style>