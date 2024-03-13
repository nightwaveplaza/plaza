<template>
  <win-window :width="420" name="credits" title="Credits" v-slot="winProps">
    <div class="pt-2 pl-2 pr-2">
      <win-memo>
        <p class="mb-2"><b>Nightwave Plaza</b> website, Android application and stream created and maintained by
          Alexander Morozov (<a href="https://discordapp.com/users/104038869388775424" target="_blank">pengu#8888</a>@discord).
        </p>
        <p class="mb-2"><b>Nightwave Plaza iOS app</b> created by <a href="https://appsquick.ly/" target="_blank">Aleksey Garbarev</a> and
          Alexander Morozov (<a href="https://discordapp.com/users/104038869388775424" target="_blank">pengu#8888</a>).
        </p>
        <p class="mb-2"><b>All musics and background images</b> belong to the authors. Musical content has been provided
          by
          authors and music labels. If you have any copyright issue, please let us know.</p>
      </win-memo>
      <div class="text-center my-2">
        <win-btn class="px-4" @click="winProps.close()">Close</win-btn>
      </div>
    </div>
  </win-window>
</template>
