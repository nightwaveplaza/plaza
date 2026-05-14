<template>
  <div class="win-start-menu-wrapper">
    <div ref="startMenuRef" class="win-start-menu noselect" :class="{ 'is-open': isOpen }">
      <div class="win-start-menu__inner">
        <div class="win-start-menu__sidebar">
          <img src="@app/assets/start-logo.svg" class="sidebar-logo" alt="Nightwave Plaza" />
        </div>

        <div class="win-start-menu__items">
          <button class="win-start-menu__item" @click="open(Win.RATINGS)">
            <img src="@app/assets/icons/winamp.png" alt="icon" />
            <span>{{ t('start_menu.ratings') }}</span>
          </button>

          <button class="win-start-menu__item" @click="open(Win.HISTORY)">
            <img src="@app/assets/icons/calendar2.png" alt="icon" />
            <span>{{ t('start_menu.play_history') }}</span>
          </button>

          <div class="win-start-menu__divider" />

          <button class="win-start-menu__item" @click="open(Win.USER_FAVORITES)">
            <img src="@app/assets/icons/user-bookmarks.png" alt="icon" />
            <span>{{ t('start_menu.my_favorites') }}</span>
          </button>

          <button class="win-start-menu__item" @click="open(Win.USER)">
            <img src="@app/assets/icons/user_computer@2x.png" alt="icon" />
            <span>{{ t('start_menu.my_profile') }}</span>
          </button>

          <div class="win-start-menu__divider" />

          <button class="win-start-menu__item" @click="open(Win.SETTINGS)">
            <img src="@app/assets/icons/settings_gear2.png" alt="icon" />
            <span>{{ t('start_menu.settings') }}</span>
          </button>

          <button class="win-start-menu__item" @click="open(Win.ABOUT)">
            <img src="@app/assets/icons/help_question_mark2.png" alt="icon" />
            <span>{{ t('start_menu.about') }}</span>
          </button>

          <button class="win-start-menu__item" @click="open(Win.SUPPORT)">
            <img src="@app/assets/icons/ball@2x.png" alt="icon" />
            <span>{{ t('start_menu.support_us') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useWindows } from '@app/composables/useWindows.ts';
  import { Win } from '@app/types';
  import { useStartMenu } from '@app/composables/useStartMenu.ts';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
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
</script>
