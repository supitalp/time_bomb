<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="EndGame"
        aria-describedby="End of game"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            End of game!
          </slot>
        </header>
        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body">
            <p>{{getTextDescription(reason)}}</p>
            <p>Good guys: {{getPlayersInTeam("Good")}}</p>
            <p>Bad guys: {{getPlayersInTeam("Bad")}}</p>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">

            <button
              type="button"
              class="btn-green"
              @click="close"
              aria-label="Close modal"
            >
              Close
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>


<script>
  export default {
    name: 'EndGameModal',
    props: ["reason"],
    methods: {
        close() {
            this.$emit('close');
        },
        getTextDescription(reason) {
          if(reason === 'bomb') {
            return "The bomb exploded! The bad guys win!";
          }
          else if(reason === 'defuse_found') {
            return "The bomb has been defused! The good guys win!";
          }
          else if(reason === 'rounds_expired') {
            return "Time expired! The good guys win!";
          }
          else {
            return "Error: I don't know why the game ended.";
          }
        },
        getPlayersInTeam(team) {
          let player_names = [];
          let players = this.$store.getters.players;
          player_names = players.filter((player) => player.team === team).map((player) => player.name);
          return player_names.join(', ')
        }
    }
  };
</script>

<style>
  .modal-backdrop {
    z-index: 2;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>
