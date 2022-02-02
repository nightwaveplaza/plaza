<template>
  <div class="app-desktop theme-win98">
    <window-support :direct="true" />
  </div>
</template>

<script>
export default {
  mounted: function() {
    this.openWindow('support');
  }
}
</script>
