<template>
    <div class="turn">
        {{players[2].name}}'s turn!
    </div>
</template>

<script>
export default {
    name: "Turn",
    props: ["players"]
}
</script>

<style scoped>
    .turn {
        background: #eeeeee;
        text-align: left;
        padding-left: 20px;
    }
</style>