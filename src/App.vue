<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 2.4vw;
  color: black;
}

.setup {
  width: 75%;
  margin: auto;
}

.btn {
    width: 40%;
    padding: 12px;
    margin: 15px;
    border: 0px;
    background: #ff5454;
    color: #ffffff;
    font-size: 2.4vmin;
    border-radius: 8px;
    cursor: pointer;
}

.btn:hover {
  background: #f38484;
}

input[type="text"] {
    background: #eeeeee;
    padding: 10px;
    margin: 7px;
    border: 0px;
    border-bottom: 1px solid #ff5454;
    text-align: center;
    font-size: 2.4vmin;
}

input[type="submit"] {
    padding: 7px;
    margin: 7px;
    border: 0px;
    background: #ff5454;
    color: #ffffff;
    font-size: 2.4vmin;
}

input[type="submit"]:disabled {
    background: #aaaaaa;
}

</style>
