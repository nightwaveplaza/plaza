import { useStore } from 'vuex'

export default function (windowName) {
  const store = useStore()

  /**
   * Open window
   * @param name
   */
  function openWindow (name) {
    store.dispatch('windows/open', { name }).then()
  }

  /**
   * Close window
   * @param name
   */
  function closeWindow (name) {
    if (name) {
      store.dispatch('windows/close', name).then()
    } else {
      store.dispatch('windows/close', windowName).then()
    }
  }

  /**
   * Show alert window
   * @param text
   * @param title
   * @param type
   */
  function alert2 (text, title, type = 'warn') {
    const id = Math.random().toString(36).substr(2, 9)
    store.dispatch('windows/open',
      { name: 'alert-' + id, text, title, type }).then()
  }

  /**
   * Show song info window
   * @param id
   */
  function songInfo2 (id) {
    store.dispatch('windows/open', { name: 'song-' + id, id }).then()
  }

  return { openWindow, closeWindow, alert2, songInfo2 }
}
