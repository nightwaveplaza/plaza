<template>
  <div class="menu-bar noselect">
    <div class="row no-gutters">
      <div class="col">
        <div class="action">
          <a role="button" tabindex="0" @click="openWindow('about')"><u>A</u>bout</a>
        </div>
        <div class="action">
          <a role="button" tabindex="1" @click="openWindow('history')">Play <u>H</u>istory</a>
        </div>
        <div class="action">
          <a role="button" tabindex="2" @click="openWindow('ratings')"><u>R</u>atings</a>
        </div>
        <div class="action">
          <a role="button" tabindex="3" @click="openWindow('support')"><u>S</u>upport Us</a>
        </div>
      </div>

      <div class="col-auto ml-auto">
        <div v-if="auth" class="action">
          <a role="button" @click="openWindow('user')">My <u>P</u>laza</a>
        </div>
        <div v-else class="action">
          <a role="button" @click="openWindow('user-login')"><u>S</u>ign In</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['auth']),
  },
};
</script>
