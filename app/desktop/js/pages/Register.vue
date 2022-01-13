<template>
  <div class="app-desktop theme-win98">
    <window-user-register :direct="true" />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('windows/pullUp', 'user-register');
  }
}
</script>
