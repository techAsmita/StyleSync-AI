import { formatSentences, hashImage } from '../utils/formatText'
import React, { useState, useRef } from 'react'
import axios from 'axios'
import { UploadCard } from './StyleMatch'

export default function LookTransfer() {
  const [imageFile, setImageFile] = useState(null)
  const [imageURL,  setImageURL]  = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const cacheRef  = useRef({})
  const resultRef = useRef()

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
      // Demo stays dynamic — no cache
      const form = new FormData()
      const res = await axios.post('/api/look-transfer', form)
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
    const res = await axios.post('/api/look-transfer', form)

    cacheRef.current[imageHash] = res.data
    setResult(res.data)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  } catch (e) {
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  const fields = result ? [
    { label: 'Length',  value: result.length  },
    { label: 'Cut',     value: result.cut      },
    { label: 'Layers',  value: result.layers   },
    { label: 'Color',   value: result.color    },
    { label: 'Texture', value: result.texture  },
    { label: 'Styling', value: result.styling  },
  ] : []

  return (
    <div style={{ background: 'var(--ivory)', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '2rem 0 2.5rem' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Look Transfer Protocol
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 600, color: 'var(--charcoal)',
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.75rem',
          }}>
            Inspiration → Stylist Brief
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Upload any celebrity or Pinterest photo. AI converts it into a precise
            stylist blueprint your salon can execute perfectly.
          </p>
        </div>

        {/* Upload */}
        <div style={{ marginBottom: '1rem' }}>
          <UploadCard
            label="Inspiration Image"
            icon="💇‍♀️"
            hint="Drop image here or Browse Files — celebrity, Pinterest, magazine"
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
              ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Generating Brief...</>
              : 'Generate Stylist Brief →'}
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
              ✦ Look Transfer Protocol
            </div>

            <div style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem',
            }}>
              Stylist Blueprint
            </div>

            {/* Blueprint Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem', marginBottom: '1rem',
            }}>
              {fields.map((f, i) => (
                <div key={i} style={{
                  background: '#FAF8F4',
                  border: '1px solid var(--border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  borderRadius: '14px', padding: '1rem',
                }}>
                  <div style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '0.4rem',
                  }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.5 }}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Stylist Notes */}
            {result.notes && (
              <div style={{
                background: 'var(--gold-light)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderLeft: '3px solid var(--gold)',
                borderRadius: '10px', padding: '1rem',
              }}>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                  color: 'var(--gold-dark)', textTransform: 'uppercase', marginBottom: '0.4rem',
                }}>
                  Stylist Notes
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--charcoal)', lineHeight: 1.75 }}>
                  {formatSentences(result.notes)}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}