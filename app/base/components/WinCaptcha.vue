<template>
  <img class="img-captcha" :src="captchaImage" @click="refresh"/>
</template>

<script>
import {captcha} from '@base/api/api';

export default {
  data() {
    return {
      captchaImage: '',
    };
  },

  mounted() {
    this.refresh();
  },

  methods: {
    async refresh() {
      const res = await captcha.get();
      this.captchaImage = res.data.img;
      this.$emit('refresh', res.data.key);
    },
  },
};
</script>
