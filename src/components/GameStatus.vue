<template>
    <div class="turn">
        <!-- <p>{{players[current_player_id].name}}'s turn!</p> -->
        <p>Round number: {{round_number}} / {{num_rounds}}</p>
    </div>
</template>

<script>
export default {
    name: "Turn",
    props: ["players", "current_player_id", "round_number", "num_rounds"]
}
</script>

<style scoped>
    .turn {
        background: #eeeeee;
        text-align: center;
        padding: 15px;
        padding-left: 25px;
    }
</style>