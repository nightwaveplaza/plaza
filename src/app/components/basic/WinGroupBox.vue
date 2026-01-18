<template>
  <div class="win-group-box">
    <div class="win-group-box__label noselect">
      <span><slot name="title" /></span>
    </div>
    <div class="win-group-box__body p-2">
      <div class="mt-1">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
