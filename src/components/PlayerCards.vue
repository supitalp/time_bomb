<template>
    <div class="cards-container">
        <p class="player-name" v-bind:class="{'is-playing':player.id == current_player_id}">{{player.name}}</p>
        <div class="cards-in-row">
            <div class="card" v-for="(card_id, index) in player.cards" :key="index">
                <img class="card-preview"
                    :src="getImgUrl(cards[card_id])"
                    v-bind:class="[{'is-playing':showCard(player, cards[card_id], current_player_id)},
                                {'blink-card':blinkCard(card_id)}]"
                    @click="clickOnCard(player, cards[card_id], current_player_id)"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayerCards",
    props: ["player"],
    methods: {
        findPlayerById(player_id) {
            return this.$store.getters.players.find(u => u.id == player_id);
        },
        getImgUrl(card) {
            var images = require.context('../../assets/cards/original/compressed');
            if(!card.visible) {
                return images('./' + 'back.png');
            }
            else if(card.type == 0) {
                return images('./' + 'neutral.png');
            }
            else if(card.type == 1) {
                return images('./' + 'defuse.png');
            }
            else {
                return images('./' + 'bomb.png');
            }
        },
        clickOnCard(player, card, current_player_id) {
            // prevent current user from doing anything if it is not is turn
            let current_player = this.findPlayerById(current_player_id);
            if(this.$store.getters.my_username !== current_player.name) {
                console.log('Cannot uncover card while it is not your turn!');
                return;
            }
            if(player.id == current_player_id) {
                console.log('Cannot uncover your own cards!');
                return; // prevent current user from selecting one of his own cards
            }
            if(card.visible) {
                console.log('Cannot uncover a card that has been uncovered already.')
                return; // prevent user from selecting an already discovered card
            }
            card.visible = true;
            this.$socket.emit("SELECT_CARD", {player: player, card: card});
        },
        showCard(player, card, current_player_id) {
            return (!card.visible && player.id == current_player_id);
        },
        blinkCard(card_id) {
            return card_id === this.$store.getters.last_card_played_id;
        }
    },
    computed: {
        my_username: function() {
            return this.$store.getters.my_username;
        },
        current_player_id: function() {
            return this.$store.getters.current_player_id;
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