<template>
  <win-window ref="window" :width="450" name="donate" title="Support Us">
    <div class="p-2">
      <div class="text-center">
        <win-memo>
          <p class="lead mb-2">Love Nightwave Plaza?</p>
          <p>You can support the radio station and further updates.</p>
          <p>You will not receive any in-app rewards by donating to us, but we will see your love and appreciation. &lt;3</p>

          <p class="my-2">
            <a href="https://plaza.one/donate" target="_blank" class="btn p-3">Go to Nightwave Plaza website</a>
          </p>
        </win-memo>
      </div>

      <div class="text-center mt-2">
        <win-btn class="mx-auto px-4" @click="closeWindow()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>
