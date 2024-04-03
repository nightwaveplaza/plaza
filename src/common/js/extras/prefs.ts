export const prefs = {
  save <T>(name: string, value: T) {
    localStorage.setItem('prefs_' + name, JSON.stringify(value))
  },

  get<T>(name: string, def?: T): T {
    const str = localStorage.getItem('prefs_' + name)
    if (str == null) {
      return def ?? null as T
    }

    try {
      return JSON.parse(str) as T
    } catch (e) {
      return def ?? null as T
    }
  }
}
