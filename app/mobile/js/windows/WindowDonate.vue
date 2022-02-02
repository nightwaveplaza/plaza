<template>
  <win-window ref="window" :width="450" name="donate" title="Support Us">
    <div class="p-2">
      <div class="text-center">
        <win-memo>
          <p class="lead mb-2">Love Nightwave Plaza?</p>
          <p>You can support the radio station and further updates.</p>
          <p>You will not receive any in-app rewards by donating to us, but we will see your love and appreciation. <3</p>

          <p class="my-3">
            <a href="https://plaza.one/donate" target="_blank" class="btn p-3">Go to Nightwave Plaza website</a>
          </p>

          <p>Thank you for donations, they will go straight into funding the station.</p>
        </win-memo>
      </div>

      <div class="text-center mt-3">
        <win-btn class="mx-auto px-4" @click="closeWindow()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>
