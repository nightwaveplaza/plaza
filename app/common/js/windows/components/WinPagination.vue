<template>
  <div class="pagination">
    <win-btn v-if="page > 1" class="mr-1" @click="nextPage(-1)">
      <i class="icon-left-hand"/>
    </win-btn>
    <input ref="page-input" type="number" value="1" @change="setPage"/>
    <win-btn v-if="pages > 1 && page < pages" class="ml-1" @click="nextPage(1)">
      <i class="icon-right-hand"/>
    </win-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
    };
  },

  watch: {
    page() {
      this.$refs['page-input'].value = this.page;
      this.$emit('change', this.page);
    },
  },

  props: {
    pages: {
      type: Number,
    },
  },

  methods: {
    nextPage(dir) {
      let page = this.page + dir;
      if (page < 1) {
        page = 1;
      }
      if (page > this.pages) {
        page = this.pages;
      }
      this.page = page;
    },

    setPage(e) {
      const page = parseInt(e.target.value);
      if (!isNaN(page) && page > 0 && page <= this.pages) {
        this.page = page;
      } else {
        this.$refs['page-input'].value = this.page;
      }
    },

    reset() {
      this.page = 1;
    },
  },
};
</script>
