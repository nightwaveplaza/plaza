<template>
  <div ref="startMenuRef" class="win-start-menu noselect" :class="{ 'is-open': isOpen }">
    <div class="win-start-menu__inner">
      <div class="win-start-menu__sidebar">
        <img src="@app/assets/start-logo.svg" class="sidebar-logo" alt="Nightwave Plaza" />
      </div>

      <div class="win-start-menu__items">
        <button class="win-start-menu__item" @click="open(Win.RATINGS)">
          <img src="@app/assets/icons/winamp.png" alt="icon" />
          <span>Ratings</span>
        </button>

        <button class="win-start-menu__item" @click="open(Win.HISTORY)">
          <img src="@app/assets/icons/calendar2.png" alt="icon" />
          <span>Play History</span>
        </button>

        <div class="win-start-menu__divider" />

        <button class="win-start-menu__item" @click="open(Win.USER_FAVORITES)">
          <img src="@app/assets/icons/user-bookmarks.png" alt="icon" />
          <span>My Favorites</span>
        </button>

        <button class="win-start-menu__item" @click="open(Win.USER)">
          <img src="@app/assets/icons/user_computer@2x.png" alt="icon" />
          <span>My Profile</span>
        </button>

        <div class="win-start-menu__divider" />

        <button class="win-start-menu__item" @click="open(Win.SETTINGS)">
          <img src="@app/assets/icons/settings_gear2.png" alt="icon" />
          <span>Settings</span>
        </button>

        <button class="win-start-menu__item" @click="open(Win.ABOUT)">
          <img src="@app/assets/icons/help_question_mark2.png" alt="icon" />
          <span>About</span>
        </button>

        <button class="win-start-menu__item" @click="open(Win.SUPPORT)">
          <img src="@app/assets/icons/ball@2x.png" alt="icon" />
          <span>Support Us</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { Win } from '@app/types';
  import { onClickOutside } from '@vueuse/core';
  import { useStartMenu } from '@app/composables/useStartMenu.ts';

  const { isOpen, closeMenu } = useStartMenu();
  const { openWindow } = useWindows();

  const startMenuRef = ref<HTMLElement | null>(null);

  function open(win: Win) {
    openWindow(win);
    closeMenu();
  }

  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    if (!isOpen.value) return;

    const target = event.target as Node;
    const menuElement = startMenuRef.value;

    const isStartButton = (target as HTMLElement).closest('.btn-start');

    if (menuElement && !menuElement.contains(target) && !isStartButton) {
      closeMenu();
    }
  };

  watch(isOpen, open => {
    if (open) {
      document.addEventListener('pointerdown', handleOutsideClick, true);
    } else {
      document.removeEventListener('pointerdown', handleOutsideClick, true);
    }
  });

  onClickOutside(
    startMenuRef,
    () => {
      if (isOpen.value) closeMenu();
    },
    {
      ignore: ['.btn-start'],
    },
  );
</script>
