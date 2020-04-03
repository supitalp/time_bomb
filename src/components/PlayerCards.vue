<template>
    <div class="cards-container">
        <p class="player-name" v-bind:class="{'is-playing':user.name == whoseTurn}">{{user.name}}</p>
        <div class="cards-in-row">
            <div class="card" v-for="(card_id, index) in user.cards" :key="index">
                <img class="card-preview"
                    :src="getImgUrl(cards[card_id])"
                    v-bind:class="{'blink-card':blinkCard(card_id),
                                   'clickable-card':canClickOnCard(user, cards[card_id]),
                                   'unclickable-card':!canClickOnCard(user, cards[card_id])}"
                    @click="clickOnCard(user, cards[card_id])"
                />
            </div>
        </div>
    </div>
</template>

<script>
import MESSAGE from '../common/message';
import CARD_TYPE from '../common/card-type'
export default {
    name: "PlayerCards",
    props: ["user"],
    methods: {
        getImgUrl(card) {
            var images = require.context('../../assets/cards/original/compressed');
            if(!card.visible) {
                return images('./' + 'back.png');
            }
            else if(card.type == CARD_TYPE.NEUTRAL) {
                return images('./' + 'neutral.png');
            }
            else if(card.type == CARD_TYPE.DEFUSE) {
                return images('./' + 'defuse.png');
            }
            else {
                return images('./' + 'bomb.png');
            }
        },
        clickOnCard(user, card) {
            if(!this.canClickOnCard(user, card)) {
                return;
            }
            card.visible = true;
            this.$socket.emit(MESSAGE.SELECT_CARD, {card_id: card.id});
        },
        blinkCard(card_id) {
            return card_id === this.$store.getters.gameState.lastCardPlayedId;
        },
        canClickOnCard(user, card) {
            if(this.$store.getters.username !== this.$store.getters.gameState.whoseTurn) {
                console.warn('Cannot uncover card while it is not your turn!');
                return false;
            }
            if(user.name === this.$store.getters.username) {
                console.warn('Cannot uncover your own cards!');
                return false;
            }
            if(card.visible) {
                console.warn('Cannot uncover a card that has been uncovered already.')
                return false;
            }
            return true;
        }
    },
    computed: {
        username: function() {
            return this.$store.getters.username;
        },
        whoseTurn: function() {
            return this.$store.getters.gameState.whoseTurn;
        },
        currentPlayerId: function() {
            return this.$store.getters.gameState.currentPlayerId;
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

<style>
    .cards-container {
        margin: auto;
        width: 95%;
        display: flex;
        background: #ffffff;
        align-items: center;
    }

    .player-name {
        flex: 1;
    }

    .cards-in-row {
        flex: 2;
        display: flex;
        /* justify-content: center; */
    }

    .card {
        padding-left: 1%;
        padding-right: 1%;
    }

    .card-preview {
        padding: 1.25px;
        width: 100%;
        max-width: 90px;
        box-shadow: 2px 2px 2px grey;
        border-radius: 6%;
    }

    .clickable-card {
        cursor: pointer;
    }

    .unclickable-card {
        cursor: not-allowed;
    }

    .clickable-card:hover {
        box-shadow: 0px 0px 20px green;
    }

    .blink-card {
        animation: blinker 0.75s linear infinite;
    }

    @keyframes blinker {
        from, to {
            box-shadow: 0px 0px 0px green;
        }
        50% {
            box-shadow: 0px 0px 20px green;
        }
    }

    .is-playing {
        font-weight: bold;
        /* -webkit-filter: grayscale(100%); */
        /* filter: grayscale(100%); */
    }

</style>