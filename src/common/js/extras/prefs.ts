export const prefs = {
  save (name: string, value: string | number | object) {
    localStorage.setItem('prefs_' + name, JSON.stringify(value))
  },

  getInt (name: string, def?: number) {
    const str = localStorage.getItem('prefs_' + name)
    if (str === null) {
      return typeof def !== 'undefined' ? def : 0
    }
    return JSON.parse(str) as number
  },

  getStr (name: string, def?: string) {
    const str = localStorage.getItem('prefs_' + name)
    if (str === null) {
      return typeof def !== 'undefined' ? def : ''
    }
    return JSON.parse(str) as string
  },

  getObj (name: string, def?: any): any {
    const str = localStorage.getItem('prefs_' + name)
    if (str === null) {
      return typeof def !== 'undefined' ? def : {}
    }
    return JSON.parse(str)
  },
}
