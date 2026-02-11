import { Win, type WindowConfig, WindowHeaderButtons } from '@app/types'

export const registry: Record<Win, WindowConfig> = {
  [Win.ABOUT]: {
    titleKey: 'win.about.title',
    width: 380,
    icon: 'help_question_mark'
  },
  [Win.ALERT]: {
    width: 290,
    isAlert: true,
    icon: 'msg_warning'
  },
  [Win.CREDITS]: {
    titleKey: 'win.credits.title',
    width: 420,
    icon: 'msg_information'
  },
  [Win.HISTORY]: {
    titleKey: 'win.history.title',
    width: 400,
    height: 600,
    icon: 'calendar'
  },
  [Win.LOADING]: {
    title: 'Nightwave Plaza',
    width: 220,
    headerButtons: []
  },
  [Win.MOBILE]: {
    title: 'Nightwave Plaza Mobile',
    width: 340,
    icon: 'modem'
  },
  [Win.NEWS]: {
    titleKey: 'win.news.title',
    width: 350,
    icon: 'document'
  },
  [Win.PLAYER]: {
    title: 'Nightwave Plaza',
    width: 450,
    headerButtons: [WindowHeaderButtons.BTN_MAXIMIZE, WindowHeaderButtons.BTN_MINIMIZE]
  },
  [Win.PLAYER_TIMER]: {
    titleKey: 'win.player_timer.title',
    width: 250,
    icon: 'clock'
  },
  [Win.RATINGS]: {
    titleKey: 'win.ratings.title',
    width: 440,
    height: 600,
    icon: 'chart'
  },
  [Win.SETTINGS]: {
    titleKey: 'win.settings.title',
    width: 280,
    icon: 'gears'
  },
  [Win.SETTINGS_LANGUAGE]: {
    titleKey: 'win.settings_language.title',
    width: 280,
    icon: 'world'
  },
  [Win.SONG]: {
    titleKey: 'win.song.title',
    width: 360,
    icon: 'cd_audio'
  },
  [Win.SUPPORT]: {
    titleKey: 'win.support.title',
    width: 450,
    icon: 'smiley'
  },
  [Win.USER]: {
    titleKey: 'win.user.title',
    width: 290,
    icon: 'user_computer'
  },
  [Win.USER_FAVORITES]: {
    titleKey: 'win.user_favorites.title',
    width: 450,
    height: 600,
    icon: 'world_star'
  },
  [Win.USER_FAVORITES_EXPORT]: {
    titleKey: 'win.user_favorites.title',
    width: 300,
    icon: 'world_star'
  },
  [Win.USER_LOGIN]: {
    titleKey: 'win.user_login.title',
    width: 480,
    icon: 'keys'
  },
  [Win.USER_PASSWORD]: {
    titleKey: 'win.user_password.title',
    width: 250,
    icon: 'keys'
  },
  [Win.USER_PROFILE_DELETE]: {
    titleKey: 'win.user_profile_delete.title',
    width: 320,
    icon: 'recycle_bin_full'
  },
  [Win.USER_PROFILE_EDIT]: {
    titleKey: 'win.user_profile_edit.title',
    width: 270,
    icon: 'settings-gear'
  },
  [Win.USER_REGISTER]: {
    titleKey: 'win.user_register.title',
    width: 430,
  },
  [Win.USER_RESET]: {
    titleKey: 'win.user_reset.title',
    width: 340,
    icon: 'keys'
  },
  [Win.USER_RESET_PASSWORD]: {
    titleKey: 'win.user_password.title',
    width: 280,
    icon: 'keys'
  },
}
