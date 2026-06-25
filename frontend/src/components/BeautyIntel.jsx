import { formatSentences, hashImage } from '../utils/formatText'
import React, { useState, useRef } from 'react'
import axios from 'axios'
import { UploadCard } from './StyleMatch'

const SCORE_LABELS = {
  dryness:      'Moisture Level',
  frizz:        'Frizz Control',
  split_ends:   'Split Ends',
  scalp_health: 'Scalp Health',
}

function ScoreBar({ label, value }) {
  const clean = Math.round(value * 10) / 10
  const color = clean >= 7 ? '#2D6A4F' : clean >= 4 ? 'var(--gold-dark)' : '#A32D2D'
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--charcoal)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{clean}/10</span>
      </div>
      <div style={{ background: 'var(--cream)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
        <div style={{
          width: `${Math.round(clean) * 10}%`, height: '100%',
          background: color, borderRadius: '4px',
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

export default function BeautyIntel() {
  const [imageFile, setImageFile] = useState(null)
  const [imageURL,  setImageURL]  = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const resultRef = useRef()
  const cacheRef  = useRef({})

  function handleFile(f) {
    setImageFile(f)
    setImageURL(URL.createObjectURL(f))
  }

  function clearFile() {
    setImageFile(null)
    setImageURL(null)
  }

  async function handleSubmit(demo = false) {
  setLoading(true)
  setResult(null)
  setError(null)
  try {
    if (demo) {
      const cases = ['healthy', 'dry', 'colour_damage', 'average']
      const form = new FormData()
      form.append('demo_case', cases[Math.floor(Math.random() * cases.length)])
      const res = await axios.post('/api/beauty-intel', form)
      setResult(res.data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      setLoading(false)
      return
    }

    const imageHash = imageFile ? await hashImage(imageFile) : 'none'

    if (cacheRef.current[imageHash]) {
      setResult(cacheRef.current[imageHash])
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      setLoading(false)
      return
    }

    const form = new FormData()
    if (imageFile) form.append('image', imageFile)
    const res = await axios.post('/api/beauty-intel', form)

    cacheRef.current[imageHash] = res.data
    setResult(res.data)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  } catch (e) {
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{ background: 'var(--ivory)', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '2rem 0 2.5rem' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Beauty Intelligence
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 600, color: 'var(--charcoal)',
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.75rem',
          }}>
            Know Your Hair Health
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Upload a close-up of your hair. AI scores moisture, frizz, split ends,
            and scalp health — then builds a personalised treatment plan.
          </p>
        </div>

        {/* Upload */}
        <div style={{ marginBottom: '1rem' }}>
          <UploadCard
            label="Hair Photo"
            icon="🔬"
            hint="Drop image here or Browse Files — natural lighting works best"
            url={imageURL}
            onFile={handleFile}
            onClear={clearFile}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading || !imageFile}
            style={{
              flex: 1,
              background: (!imageFile || loading) ? 'var(--muted)' : 'var(--charcoal)',
              color: 'var(--white)', border: 'none', padding: '0.8rem',
              borderRadius: '8px', fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: (!imageFile || loading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing Hair...</>
              : 'Analyse Hair Health →'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            style={{
              padding: '0.8rem 1.25rem',
              background: 'var(--cream)', color: 'var(--charcoal)',
              border: '1px solid var(--border)', borderRadius: '8px',
              fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
              fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Try Demo
          </button>
        </div>

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
              ✦ Beauty Intelligence AI
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

              {/* Score Bars */}
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem',
                }}>
                  Hair Health Scores
                </div>
                {Object.entries(SCORE_LABELS).map(([key, label]) => (
                  <ScoreBar key={key} label={label} value={result[key] || 5} />
                ))}
              </div>

              {/* Overall Score + Treatment */}
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem',
                }}>
                  Overall Health Score
                </div>

                {/* Score Circle */}
                <div style={{
                  background: 'var(--charcoal)', borderRadius: '14px',
                  padding: '1.5rem', textAlign: 'center', marginBottom: '1rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3.5rem', fontWeight: 600, lineHeight: 1,
                    color: result.overall_score >= 7
                      ? '#7ED49A'
                      : result.overall_score >= 4
                      ? 'var(--gold)'
                      : '#F87171',
                  }}>
                    {Math.round(result.overall_score)}
                  </div>
                  <div style={{
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)',
                    marginTop: '0.35rem', letterSpacing: '0.06em',
                  }}>
                    OUT OF 10
                  </div>
                  <div style={{
                    marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 600,
                    color: result.overall_score >= 7
                      ? '#7ED49A'
                      : result.overall_score >= 4
                      ? 'var(--gold)'
                      : '#F87171',
                  }}>
                    {result.overall_score >= 7
                      ? '✓ Healthy Hair'
                      : result.overall_score >= 4
                      ? '⚡ Needs Attention'
                      : '⚠ Immediate Care Needed'}
                  </div>
                </div>

                {/* Treatment Plan */}
                <div style={{
                  background: '#FAF8F4',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--gold)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  borderRadius: '14px', padding: '1rem',
                }}>
                  <div style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--gold-dark)', textTransform: 'uppercase', marginBottom: '0.5rem',
                  }}>
                    AI Treatment Plan
                  </div>
                  <div style={{
                    fontSize: '0.85rem', color: 'var(--charcoal)',
                    lineHeight: 1.75,
                  }}>
                    {formatSentences(result.treatment)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}