<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useWindowDialogs } from '@app/composables/useWindowDialogs.ts';

  const { showAlert } = useWindowDialogs();

  onMounted(() => {
    showAlert('Page not found.', '404');
  });
</script>
