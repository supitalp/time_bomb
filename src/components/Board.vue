<template>
    <div>
        <PlayerCards />
        <PlayerCards />
        <PlayerCards />
        <PlayerCards />
    </div>
</template>

<script>
import PlayerCards from './PlayerCards'
export default {
    name: "Board",
    components: {
        PlayerCards
    }
}
</script>

<style scoped>
    div {
        color: #000;
    }
</style>