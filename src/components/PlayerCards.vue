<template>
    <div class="cards-row">
        <div class="card" v-bind:key="card.id" v-for="card in player.cards">
            <img :src="getImgUrl(card.type)" alt="pic"/>
        </div>
        {{player.name}}
    </div>
</template>

<script>
export default {
    name: "PlayerCards",
    props: ["player"],
    methods: {
        getImgUrl(type) {
            var images = require.context('../../assets/cards/', false, /\.png$/)
            if(type == 0) {
                return images('./' + 'neutral.png');
            }
            else if(type == 1) {
                return images('./' + 'defuse.png');
            }
            else {
                return images('./' + 'bomb.png');
            }
        }
    }
}
</script>

<style scoped>
    .cards-row {
        background: #e4d297;
        padding: 10px;
        text-align: left;
        /* border: 1px solid black; */
    }

    .card {
        display: inline;
    }

    img {
        width: 70px;
        padding: 10px;
    }
</style>