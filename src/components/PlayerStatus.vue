<template>
        <div class="player-status-main">
            <div class="player-status" @click="togglePlayerStatusPanel()" v-show="isGameStatusPanelVisible">
                <div class="player-identity">
                    <p>{{my_user.name}}</p>
                    <img class="card-preview" :src="getTeamImgUrl(my_user.team)" />
                </div>
                <div class="player-cards-row">
                    <p>My cards</p>
                    <div class="my-cards">
                        <!-- https://stackoverflow.com/a/52658488 -->
                        <div class="card" v-for="i in numNeutral()" :key="'neutral' + i" :src="getImgUrl(0)" >
                            <img class="card-preview" :src="getImgNeutral()" />
                        </div>
                        <div class="card" v-for="i in numDefuse()" :key="'defuse' + i" :src="getImgUrl(1)" >
                            <img class="card-preview" :src="getImgDefuse()" />
                        </div>
                        <div class="card" v-for="i in numBombs()" :key="'bomb' + i" :src="getImgUrl(2)" >
                            <img class="card-preview" :src="getImgBomb()" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!isGameStatusPanelVisible" class="toggle-player-status" @click="togglePlayerStatusPanel()">My cards ({{my_user.name}})</div>
        </div>
</template>

<script>
import CARD_TYPE from '../common/card-type';
import TEAM from '../common/team';
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
        numNeutral() {
            let user = this.$store.getters.gameState.findUser(this.$store.getters.username);
            return this.numCardsOfType(user, CARD_TYPE.NEUTRAL);
        },
        numDefuse() {
            let user = this.$store.getters.gameState.findUser(this.$store.getters.username);
            return this.numCardsOfType(user, CARD_TYPE.DEFUSE);
        },
        numBombs() {
            let user = this.$store.getters.gameState.findUser(this.$store.getters.username);
            return this.numCardsOfType(user, CARD_TYPE.BOMB);
        },
        numCardsOfType(user, type) {
            let num = 0;
            let cards = this.$store.getters.gameState.cards;
            for(let index = 0; index < user.cards.length; ++index) {
                if(cards[user.cards[index]].type === type
                && !cards[user.cards[index]].visible) {
                    num++;
                }
            }
            return num;
        },
        getTeamImgUrl(team) {
            var images = require.context('../../assets/cards/original/compressed');
            if(team === TEAM.GOOD) {
                return images('./' + 'good_guy_1.png');
            }
            else {
                return images('./' + 'bad_guy_1.png');
            }
        },
        getImgNeutral() {
            return this.getImgUrl(CARD_TYPE.NEUTRAL);
        },
        getImgDefuse() {
            return this.getImgUrl(CARD_TYPE.DEFUSE);
        },
        getImgBomb() {
            return this.getImgUrl(CARD_TYPE.BOMB);
        },
        getImgUrl(type) {
            var images = require.context('../../assets/cards/original/compressed');
            if(type === CARD_TYPE.NEUTRAL) {
                return images('./' + 'neutral.png');
            }
            else if(type === CARD_TYPE.DEFUSE) {
                return images('./' + 'defuse.png');
            }
            else {
                return images('./' + 'bomb.png');
            }
        },
    },
    computed: {
        username: function() {
            return this.$store.getters.username;
        },
        my_user: function() {
            return this.$store.getters.gameState.users.find(u => u.name === this.$store.getters.username);
        },
        users: function() {
            return this.$store.getters.gameState.users;
        },
        cards: function() {
            return this.$store.getters.gameState.cards;
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