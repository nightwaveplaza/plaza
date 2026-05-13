import { ref } from 'vue';

const isOpen = ref(false);

export function useStartMenu() {
  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };

  const closeMenu = () => {
    if (isOpen.value) isOpen.value = false;
  };

  const openMenu = () => {
    if (!isOpen.value) isOpen.value = true;
  };

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    openMenu,
  };
}
