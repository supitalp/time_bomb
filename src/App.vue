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
  font-size: 3px;
  color: black;
}

.setup {
}

p,div {
  font-size: 17px;
}

.btn {
    padding: 12px;
    margin: 15px;
    border: 0px;
    background: #ff5454;
    color: #ffffff;
    font-size: 19px;
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
    font-size: 19px;
}

input[type="submit"] {
    padding: 7px;
    margin: 7px;
    border: 0px;
    background: #ff5454;
    color: #ffffff;
    font-size: 19px;
}

input[type="submit"]:disabled {
    background: #aaaaaa;
}

.warning {
  color: rgb(206, 11, 11);
}

@media only screen and (max-width: 600px) {
    p,div {
        font-size: 14px;
    }
    .btn {
      font-size: 16px;
    }
    input[type="text"] {
      font-size: 14px;
    }
    input[type="submit"] {
      font-size: 16px;
    }
}

</style>
