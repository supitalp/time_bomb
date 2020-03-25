<template>
    <div class="game-status">
        <!-- <p>{{current_player_name}}'s turn!</p> -->
        <p>Round number: {{this.$store.getters.round_number}} / {{this.$store.getters.num_rounds}}</p>
        <p>Number of defuse found: {{this.numDefuseFound()}} / {{this.$store.getters.players.length}}</p>
        <!-- <div class="round_counter">
            <div class="token" >
                <img :src="getTokenImgUrl(1)"
                    :class="{'is-elapsed':this.$store.getters.round_number >= 1}" />
            </div>
            <div class="token" >
                <img :src="getTokenImgUrl(2)"
                :class="{'is-elapsed':this.$store.getters.round_number >= 2}"/>
            </div>
            <div class="token" >
                <img :src="getTokenImgUrl(3)"
                :class="{'is-elapsed':this.$store.getters.round_number >= 3}" />
            </div>
            <div class="token" >
                <img :src="getTokenImgUrl(4)"
                :class="{'is-elapsed':this.$store.getters.round_number >= 4}" />
            </div>
        </div>
        <div class="defuse_counter">
            <div v-for="i in num_players" :key="i" >
                <img :src="getDefuseImgUrl()"
                    :class="{'is-defuse-found':numDefuseFound() < i}" />
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: "Turn",
    methods: {
        numDefuseFound() {
            var cards = this.$store.getters.cards;
            var num_defuse_found = 0;
            for(var i = 0; i < cards.length; ++i) {
                if(cards[i].type == 1 && cards[i].visible) num_defuse_found++;
            }
            return num_defuse_found;
        },
        getTokenImgUrl(token) {
            var images = require.context('../../assets/tokens/');
                return images('./' + 'token_' + token + '.png');
        },
        getDefuseImgUrl() {
            var images = require.context('../../assets/cards/original/');
                return images('./' + 'defuse.png');
        }
    },
    computed: {
        current_player_name: function() {
            return this.$store.getters.players[this.$store.getters.current_player_id].name;
        },
        num_players: function() {
            return this.$store.getters.players.length;
        }
    }
}
</script>

<style scoped>
    .game-status {
        width: 95%;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: white;
        padding: 0px;
        border-bottom: 1px grey solid;
        /* border: 1px black solid; */
    }

    .round_counter {
        flex: 1;
        display: flex;
        /* border: 1px black solid; */
    }

    .defuse_counter {
        flex: 1;
        display: flex;
        padding: 10px;
        /* border: 1px black solid; */
    }

    .is-elapsed {
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

    .is-defuse-found {
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

    .token img {
        width: 75%;
        /* border: 1px black solid; */
    }

    .defuse_counter img {
        width: 70%;
        border: 1px black solid;
        box-shadow: 2px 2px grey;
        border-radius: 6%;
    }

</style>