export const int = (n) => Math.round(Number(n) || 0)
export const pct = (n) => Math.round(Number(n) || 0)
/**
 * formatSentences — universal AI text normaliser
 * - Sentence case (capital first letter per sentence)
 * - Ensures terminal punctuation
 * - Preserves proper nouns, abbreviations, and ALL-CAPS tokens
 */

// Known proper nouns / abbreviations to always preserve
const PRESERVE = new Set([
  'AI', 'UV', 'SPF', 'DNA', 'pH', 'INR', 'GST', 'UPI',
  'StyleSync', 'RevenuePilot', 'StyleMatch',
])

function capitaliseFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function ensurePunctuation(str) {
  const trimmed = str.trimEnd()
  if (!trimmed) return trimmed
  const last = trimmed[trimmed.length - 1]
  if (['.', '!', '?'].includes(last)) return trimmed
  return trimmed + '.'
}

function preserveTokens(sentence) {
  // Split into words, fix casing per word only when safe
  return sentence
    .split(' ')
    .map((word, i) => {
      // Strip punctuation to check the core word
      const core = word.replace(/[^a-zA-Z0-9]/g, '')
      // Always preserve known tokens
      if (PRESERVE.has(core)) return word
      // Always preserve ALL-CAPS abbreviations (2-5 chars like UV, SPF, DNA)
      if (/^[A-Z]{2,5}$/.test(core)) return word
      // First word of sentence — already capitalised by capitaliseFirst
      if (i === 0) return word
      return word
    })
    .join(' ')
}

export function formatSentences(text) {
  if (!text || typeof text !== 'string') return ''

  // Split on sentence-ending punctuation followed by whitespace
  const raw = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)

  if (raw.length === 0) {
    // No punctuation found — treat whole thing as one sentence
    return ensurePunctuation(capitaliseFirst(preserveTokens(text.trim())))
  }

  return raw
    .map(sentence => {
      const trimmed = sentence.trim()
      const capped  = capitaliseFirst(trimmed)
      const preserved = preserveTokens(capped)
      return ensurePunctuation(preserved)
    })
    .join(' ')
}

// Image fingerprint using SHA-256 via Web Crypto API
export async function hashImage(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}