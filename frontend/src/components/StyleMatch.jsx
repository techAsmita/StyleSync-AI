import { formatSentences, hashImage } from '../utils/formatText'
import React, { useState, useRef } from 'react'
import axios from 'axios'

const GOALS = ['Volume & Body', 'Sleek & Straight', 'Beachy Waves', 'Natural Texture', 'Color & Highlights', 'Low Maintenance']

const SALONS = [
  { name: 'Lakshmi Beauty Studio', dist: '0.8 km', spec: 'Hair Specialist', rating: '4.8', match: 98 },
  { name: 'Aura Salon & Spa',      dist: '1.4 km', spec: 'Premium Cuts',    rating: '4.6', match: 91 },
  { name: 'Glamour House',         dist: '2.1 km', spec: 'Colour Expert',   rating: '4.5', match: 85 },
]

// ── Reusable Upload Card ────────────────────────────────────────────────────
export function UploadCard({ label, icon, hint, url, onFile, onClear }) {
  const inputRef = useRef()
  const [hovering, setHovering] = useState(false)

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '1.25rem',
    }}>
      <div style={{
        fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
        color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
      }}>
        {label}
      </div>

      {/* Preview State */}
      {url ? (
        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            height: '220px',
            background: '#faf8f4',
            cursor: 'pointer',
            transition: '250ms ease',
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img
            src={url}
            alt="uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '12px',
              display: 'block',
              transition: '250ms ease',
            }}
          />

          {/* Hover Overlay */}
          {hovering && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: '250ms ease',
            }}>
              <button
                onClick={() => inputRef.current.click()}
                style={{
                  background: 'var(--white)', color: 'var(--charcoal)',
                  border: 'none', borderRadius: '6px',
                  padding: '0.45rem 1rem', fontSize: '0.8rem',
                  fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Replace Image
              </button>
              <button
                onClick={onClear}
                style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px',
                  padding: '0.35rem 1rem', fontSize: '0.78rem',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Uploaded Badge */}
          <div style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem',
            background: 'var(--gold)', color: 'var(--white)',
            fontSize: '0.65rem', fontWeight: 700,
            padding: '0.2rem 0.55rem', borderRadius: '20px',
            letterSpacing: '0.04em',
          }}>
            ✓ Ready
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: '2px dashed var(--border)',
            borderRadius: '12px',
            height: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'var(--cream)',
            transition: '250ms ease',
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--gold)'
            e.currentTarget.style.background = 'var(--gold-light)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.background = 'var(--cream)'
          }}
        >
          <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{icon}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--charcoal)', fontWeight: 500, marginBottom: '0.25rem' }}>
            Click to upload
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', padding: '0 1rem' }}>
            {hint}
          </div>
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const f = e.target.files[0]
          if (f) onFile(f)
        }}
      />
    </div>
  )
}

// ── StyleMatch Page ─────────────────────────────────────────────────────────
export default function StyleMatch() {
  const [goals, setGoals]         = useState(['Volume & Body'])
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfieURL,  setSelfieURL]  = useState(null)
  const [inspoFile,  setInspoFile]  = useState(null)
  const [inspoURL,   setInspoURL]   = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [result,     setResult]     = useState(null)
  const [error,      setError]      = useState(null)
  const [animScore,  setAnimScore]  = useState(0)
  const cacheRef  = useRef({})
  const resultRef = useRef()

  function toggleGoal(g) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  function handleSelfie(f) { setSelfieFile(f); setSelfieURL(URL.createObjectURL(f)) }
  function handleInspo(f)  { setInspoFile(f);  setInspoURL(URL.createObjectURL(f)) }
  function clearSelfie()   { setSelfieFile(null); setSelfieURL(null) }
  function clearInspo()    { setInspoFile(null);  setInspoURL(null) }

  async function handleSubmit() {
  setLoading(true)
  setResult(null)
  setError(null)
  setAnimScore(0)
  try {
    // Build cache key from image hashes + goals
    const selfieHash = selfieFile ? await hashImage(selfieFile) : 'none'
    const inspoHash  = inspoFile  ? await hashImage(inspoFile)  : 'none'
    const cacheKey   = `${selfieHash}-${inspoHash}-${goals.join(',')}`

    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey]
      setResult(cached)
      animateScore(Math.round(cached.score) || 82)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      setLoading(false)
      return
    }

    const form = new FormData()
    form.append('goals', goals.join(', ') || 'Volume & Body')
    if (selfieFile) form.append('selfie', selfieFile)
    if (inspoFile)  form.append('inspiration', inspoFile)
    const res = await axios.post('/api/style-match', form)

    cacheRef.current[cacheKey] = res.data
    setResult(res.data)
    animateScore(Math.round(res.data.score) || 82)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  } catch (e) {
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  function animateScore(target) {
    const cleanTarget = Math.round(target)
    let current = 0
    const interval = setInterval(() => {
      current += 2
      setAnimScore(Math.min(current, cleanTarget))
      if (current >= cleanTarget) clearInterval(interval)
    }, 18)
  }

  const circumference = 2 * Math.PI * 54
  const offset = result ? circumference - (circumference * (animScore / 100)) : circumference

  return (
    <div style={{ background: 'var(--ivory)', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '2rem 0 2.5rem' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            AI StyleMatch
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 600, color: 'var(--charcoal)',
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.75rem',
          }}>
            Find Your Perfect Look
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Upload your selfie and an inspiration image. AI analyses your face shape
            and recommends the best-fit style with a compatibility score.
          </p>
        </div>

        {/* Upload Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <UploadCard
            label="Your Selfie"
            icon="🤳"
            hint="Front-facing photo works best"
            url={selfieURL}
            onFile={handleSelfie}
            onClear={clearSelfie}
          />
          <UploadCard
            label="Inspiration Image"
            icon="✨"
            hint="Celebrity, Pinterest, magazine"
            url={inspoURL}
            onFile={handleInspo}
            onClear={clearInspo}
          />
        </div>

        {/* Goals */}
        <div style={{
          background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Hair Goals
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '20px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                  background: goals.includes(g) ? 'var(--gold-light)' : 'var(--cream)',
                  color:      goals.includes(g) ? 'var(--gold-dark)'  : 'var(--muted)',
                  borderColor:goals.includes(g) ? 'var(--gold)'       : 'var(--border)',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'var(--muted)' : 'var(--charcoal)',
            color: 'var(--white)', border: 'none', padding: '0.85rem',
            borderRadius: '8px', fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            marginBottom: '1.5rem', transition: 'all 0.2s',
          }}
        >
          {loading
            ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing style compatibility...</>
            : 'Analyse My Style Compatibility →'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
            color: '#991B1B', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="fade-up" style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.68rem', fontWeight: 600, color: 'var(--gold-dark)',
              background: 'var(--gold-light)', padding: '0.2rem 0.6rem',
              borderRadius: '20px', marginBottom: '1rem',
            }}>
              ✦ StyleMatch AI
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' }}>

              {/* Score Ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
                }}>
                  Compatibility Score
                </div>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="var(--cream)" strokeWidth="10" />
                  <circle
                    cx="70" cy="70" r="54" fill="none"
                    stroke="var(--gold)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                  />
                  <text x="70" y="65" textAnchor="middle"
                    fontFamily="Playfair Display, serif" fontSize="28" fontWeight="600" fill="var(--charcoal)">
                    {animScore}
                  </text>
                  <text x="70" y="83" textAnchor="middle"
                    fontFamily="Inter, sans-serif" fontSize="10" fill="var(--muted)">
                    MATCH
                  </text>
                </svg>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                  {(result.tags || []).map(t => (
                    <span key={t} style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      background: 'var(--gold-light)', color: 'var(--gold-dark)',
                      padding: '0.2rem 0.6rem', borderRadius: '20px',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
                }}>
                  AI Recommendation
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.1rem', fontWeight: 600, color: 'var(--charcoal)',
                  }}>
                    {result.style}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Face Shape: <strong style={{ color: 'var(--charcoal)' }}>{result.face_shape}</strong>
                </div>
                <div style={{
                  background: 'var(--cream)', borderRadius: '10px',
                  padding: '1rem', fontSize: '0.85rem', color: 'var(--charcoal)',
                  lineHeight: 1.75, marginTop: '0.75rem',
                }}>
                  {formatSentences(result.recommendation)}
                </div>
              </div>
            </div>

            {/* Salon Chips */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
              }}>
                Best-Fit Salons Nearby
              </div>
              {SALONS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 1rem', borderRadius: '8px',
                  background: 'var(--cream)', marginBottom: '0.5rem',
                  border: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--charcoal)' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.dist} · {s.spec} · ⭐ {s.rating}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gold-dark)' }}>{s.match}% match</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}