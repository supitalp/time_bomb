<template>
    <header class="header">
        <h1>TimeBomb Online</h1>
    </header>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style scoped>
    .header {
        padding-top: 100px;
        color: black;
        text-align: center;
        margin-bottom: 25px;
    }

    h1 {
        font-size: 45px;
        display: inline;
    }

    @media only screen and (max-width: 600px) {
        h1 {
            font-size: 32px;
        }
    }

</style>