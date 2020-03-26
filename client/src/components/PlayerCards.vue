<template>
    <div class="cards-container">
        <p class="player-name" v-bind:class="{'is-playing':player.id == current_player_id}">{{player.name}}</p>
        <div class="cards-in-row">
            <img v-for="(card_id, index) in player.cards" :key="index"
                class="card-preview"
                :src="getImgUrl(cards[card_id])"
                v-bind:class="[{'is-playing':showCard(player, cards[card_id], current_player_id)},
                               {'blink-card':blinkCard(card_id)}]"
                @click="clickOnCard(player, cards[card_id], current_player_id)" />
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayerCards",
    props: ["player"],
    methods: {
        getImgUrl(card) {
            var images = require.context('../../assets/cards/original');
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
            if(this.$store.getters.my_username !== this.$store.getters.players[current_player_id].name) {
                console.log('Cannot uncover card while it is not your turn!');
                return;
            }
            if(player.id == current_player_id) {
                return; // prevent current user from selecting one of his own cards
            }
            if(card.visible) {
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
        width: 85%;
        display: flex;
        background: #ffffff;
        align-items: center;
        /* border: 1px black solid; */
    }

    .player-name {
        flex: 1;
        /* border: 1px black solid; */
    }

    .cards-in-row {
        flex: 5;
        display: flex;
        justify-content: space-evenly;
        /* border: 1px black solid; */
    }

    .card {
        display: inline;
        padding-left: 1%;
        padding-right: 1%;
    }

    .card-preview {
        padding: 1.25px;
        width: 15%;
        max-width: 90px;
        box-shadow: 2px 2px grey;
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
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

</style>