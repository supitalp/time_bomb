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
            <p>{{getTextDescription()}}</p>
            <p>Good guys: {{getUsersInTeamGood()}}</p>
            <p>Bad guys: {{getUsersInTeamBad()}}</p>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">

            <button
              type="button"
              class="btn-red"
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
  import GAME_END from '../common/game-end'
  import TEAM from '../common/team'
  export default {
    name: 'EndGameModal',
    methods: {
        close() {
            this.$emit('close');
        },
        getTextDescription() {
          let game_end = this.$store.getters.gameState.gameEnd;
          if(game_end === GAME_END.BOMB_EXPLODED) {
            return "The bomb exploded! The bad guys win!";
          }
          else if(game_end === GAME_END.ALL_DEFUSE_FOUND) {
            return "The bomb has been defused! The good guys win!";
          }
          else if(game_end === GAME_END.TIME_EXPIRED) {
            return "Time expired! The bad guys win!";
          }
          else if(game_end === GAME_END.USER_DISCONNECTED) {
            return "Error: " + this.$store.getters.gameState.username + " has disconnected. Unfortunately we must stop the game :("
          }
          else {
            return "Error: I don't know why the game ended.";
          }
        },
        getUsersInTeamGood() {
          return this.getUsersInTeam(TEAM.GOOD);
        },
        getUsersInTeamBad() {
          return this.getUsersInTeam(TEAM.BAD);
        },
        getUsersInTeam(team) {
          let users = this.$store.getters.gameState.users;
          let usernames = users.filter((u) => u.team === team).map((u) => u.name);
          return usernames.join(', ')
        }
    }
  };
</script>

<style>
  .modal-backdrop {
    z-index: 10;
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
    color: #ff5454;
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
    color: #ff5454;
    background: transparent;
  }

  .btn-red {
    padding: 10px;
    color: white;
    background: #ff5454;
    border: 0px;
    border-radius: 2px;
  }

  .btn-red:hover {
    background: #f38484;
  }

</style>
