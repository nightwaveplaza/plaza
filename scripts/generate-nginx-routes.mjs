// Generates the nginx `map $uri $spa_match` include from the Vue router routes
// Run only at container build time, not on every yarn build

import fs from 'node:fs'
import path from 'node:path'

const routesFile = process.env.NGINX_ROUTES_FILE ?? 'src/app/router/routes.ts'
const outDir = process.env.NGINX_ROUTES_OUT_DIR ?? 'dist'
const mapVar = '$spa_match'

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    console.error(`[nginx-routes] Не удалось прочитать ${filePath}:`, e)
    return ''
  }
}

// Very simple parser "path: '...'" / "path: \"...\""
function extractRoutesFromSource(src) {
  const routes = []
  const re = /path\s*:\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)\s*(?:,|\n|\r|\})/g
  let m
  while ((m = re.exec(src))) {
    const p = m[1] ?? m[2] ?? m[3] ?? ''
    if (!p) continue
    routes.push({ path: p })
  }
  return routes
}

// Translate Vue path to nginx regex
// - :id  -> [^/]+
// - :id? -> (?:/[^/]+)?
// - trail slash optional
function vuePathToNginxRegex(vuePath) {
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
          // "/:id" -> "/[^/]+"
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

const abs = path.resolve(process.cwd(), routesFile)
const src = readFileSafe(abs)
if (!src) {
  console.error(`[nginx-routes] Route file not found or empty: ${abs}`)
  process.exit(1)
}

const found = extractRoutesFromSource(src)
const regexLines = []

for (const r of found) {
  const rx = vuePathToNginxRegex(r.path)
  if (!rx) continue
  regexLines.push(`    ~${rx} 1;`)
}

const confLines = [`map $uri ${mapVar} {`, `    default 0;`, ...regexLines, `}`, ``]

const outPath = path.resolve(process.cwd(), outDir, 'generated-routes.conf')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, confLines.join('\n'), 'utf8')
console.log(`✅ [nginx-routes] manifest: ${outPath}`)
