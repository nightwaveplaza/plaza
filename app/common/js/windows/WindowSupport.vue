<template>
  <win-window ref="window" :width="450" name="support" title="Support Us">
    <div class="p-2">
      <div class="text-center">
        <win-memo>
          <p class="lead mb-2">Love Nightwave Plaza?</p>
          <p>The radio station is non-profit and ad-free, but it requires some funds to stay online and develop.</p>
          <p>You can support the radio station and further updates by donating via PayPal or join our Patreon and get
            special rewards!</p>

          <p class="my-3">
            <a href="https://www.paypal.me/nightwaveplaza" target="_blank" class="pp-link mr-4">
              <img alt="paypal" src="img/paypal.png"/><br />Donate via PayPal
            </a>
            <a class="pp-link" href="https://www.patreon.com/nightwaveplaza" target="_blank">
              <img alt="patreon" src="img/patreon.png"/><br />Support on Patreon
            </a>
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
