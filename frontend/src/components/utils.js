// ── Number normalisers ────────────────────────────────────────────────────────
export const int  = (n) => Math.round(Number(n) || 0)
export const pct  = (n) => Math.round(Number(n) || 0)
export const dec1 = (n) => Math.round((Number(n) || 0) * 10) / 10

// ── Sentence formatter ────────────────────────────────────────────────────────
// Splits on sentence boundaries, capitalises first letter, ensures punctuation.
export function formatSentences(text) {
  if (!text || typeof text !== 'string') return ''

  // Split on '. ', '! ', '? ', or newlines
  const raw = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean)

  return raw.map(sentence => {
    // Capitalise first character, preserve rest
    let s = sentence.charAt(0).toUpperCase() + sentence.slice(1)

    // Ensure sentence ends with punctuation
    if (!/[.!?]$/.test(s)) s = s + '.'

    return s
  }).join(' ')
}

// ── Capitalise a single short string (labels, tags, names) ───────────────────
export function cap(text) {
  if (!text || typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}