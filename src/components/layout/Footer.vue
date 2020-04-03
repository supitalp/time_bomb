<template>
    <footer class="footer">
        <p>
            TimeBomb Online is based on Iello's tabletop game,
            <br />
            <a href="https://www.iello.fr/fr/fiche/time-bomb">TimeBomb</a>.
            <br />
            <!-- Part of the code was borrowed from the <a href="https://kc-fakeartistonline.herokuapp.com/">Fake Artist Online</a>. -->
            <br />
            <a href="https://github.com/supitalp/time_bomb">Github</a>
        </p>
    </footer>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style scoped>
    .footer {
        width: 90%;
        margin: auto;
        padding-top: 25px;
    }

    p {
        font-size: 17px;
    }

    @media only screen and (max-width: 600px) {
        p {
            font-size: 13px;
        }
    }

    a {
        color: rgb(255, 58, 58);
    }
</style>