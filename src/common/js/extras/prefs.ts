export const prefs = {
  save <T>(name: string, value: T) {
    localStorage.setItem('prefs_' + name, JSON.stringify(value))
  },

  get<T>(name: string, def?: T): T | undefined {
    const str = localStorage.getItem('prefs_' + name)
    if (str == null) {
      return def
    }

    try {
      return JSON.parse(str) as T
    } catch (e) {
      return def
    }
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

  getObj <T>(name: string, def?: T): T | undefined {
    const str = localStorage.getItem('prefs_' + name)
    if (str === null) {
      return def
    }
    return JSON.parse(str) as T
  },
}
