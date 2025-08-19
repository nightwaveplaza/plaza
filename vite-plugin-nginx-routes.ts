import fs from 'node:fs'
import path from 'node:path'

type FoundRoute = { path: string };

function readFileSafe (filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    console.error(`[nginx-routes] Не удалось прочитать ${filePath}:`, e)
    return ''
  }
}

// Very simple parser "path: '...'" / "path: \"...\""
function extractRoutesFromSource (src: string): FoundRoute[] {
  const routes: FoundRoute[] = []
  const re =
    /path\s*:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)\s*(?:,|\n|\r|\})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const p = m[1] ?? m[2] ?? m[3] ?? ''
    if (!p) continue
    routes.push({ path: p })
  }
  return routes
}

// Translate Vue path to nginx regex
// - :id        -> [^/]+
// - :id?       -> (?:/[^/]+)?
// - trail slash optional
function vuePathToNginxRegex (vuePath: string): string | null {
  // Ignore catch-all
  if (vuePath.includes(':pathMatch')) return null

  // Ignore /404
  if (vuePath === '/404') return null

  // Normalize lead slash
  if (!vuePath.startsWith('/')) vuePath = '/' + vuePath

  const segments = vuePath.split('/').filter(Boolean)
  let regex = '^'

  if (segments.length === 0) {
    // root "/"
    regex += '/?'
  } else {
    for (const seg of segments) {
      if (seg.startsWith(':')) {
        const isOptional = seg.endsWith('?')
        if (isOptional) {
          // "/:id?" -> "(?:/[^/]+)?"
          regex += '(?:/[^/]+)?'
        } else {
          // "/:id"  -> "/[^/]+"
          regex += '/[^/]+'
        }
      } else {
        const esc = seg.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        regex += `/${esc}`
      }
    }

    regex += '/?'
  }

  regex += '$'
  return regex
}

export default function nginxRoutesPlugin (options?: {
  routesFile?: string;
  outDir?: string;
  mapVar?: string;
}) {
  const routesFile = options?.routesFile ?? 'src/router/routes.ts'
  const outDir = options?.outDir ?? 'dist'
  const mapVar = options?.mapVar ?? '$spa_match'

  return {
    name: 'vite-plugin-nginx-routes',
    apply: 'build' as const,
    closeBundle () {
      const abs = path.resolve(process.cwd(), routesFile)
      const src = readFileSafe(abs)
      if (!src) {
        console.warn(
          `[nginx-routes] Route file not found or empty: ${abs}`
        )
        return
      }

      const found = extractRoutesFromSource(src)
      const regexLines: string[] = []

      for (const r of found) {
        const rx = vuePathToNginxRegex(r.path)
        if (!rx) continue
        regexLines.push(`    ~${rx} 1;`)
      }

      const confLines = [
        `map $uri ${mapVar} {`,
        `    default 0;`,
        ...regexLines,
        `}`,
        ``
      ]

      const outPath = path.resolve(process.cwd(), outDir, 'generated-routes.conf')
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, confLines.join('\n'), 'utf8')
      console.log(`✅ [nginx-routes] manifest: ${outPath}`)
    }
  }
}
