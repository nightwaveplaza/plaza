<template>
  <button class="win-button" :disabled="disabled" @click="emit('click')">
    <img
      v-if="icon"
      :src="btnIcon.src"
      :srcset="btnIcon.srcset"
      alt=""
      class="win-button__icon"
      draggable="false"
    />
    <span v-if="slots.default" class="win-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import { getIcon, type IconData } from '@app/utils/icons.ts';

  const slots = useSlots();

  const props = withDefaults(
    defineProps<{
      disabled?: boolean;
      icon?: string | IconData;
    }>(),
    {
      disabled: false,
      icon: '',
    },
  );

  const btnIcon = computed(() => {
    if (typeof props.icon === 'string') {
      return getIcon(props.icon);
    }
    return props.icon;
  });

  const emit = defineEmits(['click']);
</script>
