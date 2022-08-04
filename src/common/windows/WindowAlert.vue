<template>
  <win-window ref="window" :isAlert="true" :name="name" :title="title" :width=290>
    <div class="p-2">
      <div class="row no-gutters">
        <div class="col-auto text-center align-self-center">
          <div class="alert-icon" :class="type"/>
        </div>
        <div class="col align-self-center">
          <p class="pl-2" style="line-height: 125%" v-html="text"/>
        </div>
      </div>

      <div class="text-center">
        <win-btn class="mt-2 mx-auto px-4" @click="closeWindow()">OK</win-btn>
      </div>
    </div>
  </win-window>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
  },
};
</script>
