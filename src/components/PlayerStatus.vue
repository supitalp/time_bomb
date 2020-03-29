<template>
        <div class="player-status-main">
            <div class="player-status" @click="togglePlayerStatusPanel()" v-show="isGameStatusPanelVisible">
                <div class="player-identity">
                    <p>{{my_player.name}}</p>
                    <img class="card-preview" :src="getTeamImgUrl(my_player.team)" />
                </div>
                <div class="player-cards-row">
                    <p>My cards</p>
                    <div class="my-cards">
                        <!-- https://stackoverflow.com/a/52658488 -->
                        <div class="card" v-for="i in numCardsOfType(my_player, cards, 0)" :key="'neutral' + i" :src="getImgUrl(0)" >
                            <img class="card-preview" :src="getImgUrl(0)" />
                        </div>
                        <div class="card" v-for="i in numCardsOfType(my_player, cards, 1)" :key="'defuse' + i" :src="getImgUrl(1)" >
                            <img class="card-preview" :src="getImgUrl(1)" />
                        </div>
                        <div class="card" v-for="i in numCardsOfType(my_player, cards, 2)" :key="'bomb' + i" :src="getImgUrl(2)" >
                            <img class="card-preview" :src="getImgUrl(2)" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!isGameStatusPanelVisible" class="toggle-player-status" @click="togglePlayerStatusPanel()">My cards ({{my_player.name}})</div>
        </div>
</template>

<script>
export default {
    name: "PlayerStatus",
    data () {
        return {
            isGameStatusPanelVisible: true
        }
    },
    methods: {
        togglePlayerStatusPanel() {
            this.isGameStatusPanelVisible = !this.isGameStatusPanelVisible;
        },
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
            var images = require.context('../../assets/cards/original/compressed');
            if(team === "Good") {
                return images('./' + 'good_guy_1.png');
            }
            else {
                return images('./' + 'bad_guy_1.png');
            }
        },
        getImgUrl(type) {
            var images = require.context('../../assets/cards/original/compressed');
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

    .player-status-main {
        position: sticky;
        bottom: 0;
        z-index: 5;
        width: 100%;
        margin: auto;
        background: #ffffff;
        border-top: 1px grey solid;
    }

    .player-status {
        display: flex;
        flex-direction: row;
    }

    .player-identity {
        flex: 1;
        border-right: 1px grey solid;
    }

    .player-cards-row {
        flex: 4;
    }

    .my-cards {
        display: flex;
        justify-content: center;
    }

    .card {
        padding-left: 1%;
        padding-right: 1%;
    }

    .card-preview {
        width: 90%;
        max-width: 10vmin;
    }

    p {
        padding: 2px;
    }

    .toggle-player-status {
        padding: 3px;
    }

</style>