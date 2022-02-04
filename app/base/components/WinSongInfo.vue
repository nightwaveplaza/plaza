<template>
  <div>
    <window-song :id="s.id" :name="s.name" v-for="s in songWindows" :key="s.id"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {

  computed: {
    ...mapGetters('windows', ['songWindows']),
  },
};
</script>
