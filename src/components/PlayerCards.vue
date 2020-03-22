<template>
    <div class="cards-row">
        <div class="card" v-for="(card_id, index) in player.cards"
                          :key="index">
            <!-- {{card_id}} -->
            <img :src="getImgUrl(cards[card_id])"
                 v-bind:class="{'is-playing':showCard(player, cards[card_id], current_player_id)}"
                 @click="clickOnCard(player, cards[card_id], current_player_id)" />
        </div>
        <p class="player-name" v-bind:class="{'is-playing':player.id == current_player_id}">{{player.name}}</p>
    </div>
</template>

<script>
export default {
    name: "PlayerCards",
    props: ["player", "cards", "current_player_id"],
    methods: {
        getImgUrl(card) {
            var images = require.context('../../assets/cards/', false, /\.png$/)
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
            if(player.id == current_player_id) {
                return; // prevent current user to select one of his own cards
            }
            if(card.visible) {
                return; // prevent selecting an already discovered card
            }
            card.visible = true;
            this.$emit('next-turn');
        },
        showCard(player, card, current_player_id) {
            return (!card.visible && player.id == current_player_id);
        }
    }
}
</script>

<style scoped>
    .cards-row {
        background: #FFD271;
        padding: 15px;
        text-align: left;
    }

    .card {
        display: inline;
    }

    img {
        width: 70px;
        padding-right: 30px;
    }

    .player-name {
        display: inline;
    }

    .is-playing {
        font-weight: bold;
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

</style>