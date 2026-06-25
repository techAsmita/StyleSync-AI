import React from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    tag: 'Primary Differentiator',
    title: 'RevenuePilot AI',
    desc: 'Forecasts occupancy gaps before they become lost revenue. Generates targeted campaigns with projected bookings, revenue impact, and growth opportunities.',
    icon: '📈',
    path: '/revenue-pilot',
    metrics: ['+ 31.7% Revenue Lift', '₹26K Monthly Gain', 'Occupancy Forecasting'],
  },
  {
    tag: 'Style Intelligence',
    title: 'AI StyleMatch',
    desc: 'Analyses face shape from a selfie and compares it with inspiration images to generate compatibility scores, recommended styles, and personalised beauty insights.',
    icon: '✨',
    path: '/style-match',
    metrics: ['Face Shape AI', 'Compatibility Score', 'Salon Matching'],
  },
  {
    tag: 'Communication Layer',
    title: 'Look Transfer Protocol',
    desc: 'Transforms inspiration images into precise stylist-ready instructions including length, layers, texture, colour guidance, and styling notes.',
    icon: '💇‍♀️',
    path: '/look-transfer',
    metrics: ['6-Point Blueprint', 'Pro Terminology', 'Zero Miscommunication'],
  },
  {
    tag: 'Hair Intelligence',
    title: 'Beauty Intelligence',
    desc: 'Evaluates dryness, frizz, split ends, and scalp condition from uploaded images, then creates personalised treatment recommendations.',
    icon: '🔬',
    path: '/beauty-intel',
    metrics: ['4 Health Metrics', 'Treatment Plan', 'Personalised Advice'],
  },
]

const exploreBtn = {
  background: 'var(--charcoal)',
  color: 'var(--white)',
  border: 'none',
  padding: '0.75rem 1.3rem',
  borderRadius: '10px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.82rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
}

export default function Features() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--ivory)', padding: '2rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '2rem 0 3rem' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            AI Ecosystem
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600, color: 'var(--charcoal)',
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1rem',
          }}>
            Four AI Systems.<br />One Revenue Engine.
          </h1>
          <p style={{
            fontSize: '1rem', color: 'var(--muted)',
            maxWidth: '560px', margin: '0 auto', lineHeight: 1.8,
          }}>
            StyleSync AI combines revenue intelligence for salons with personalised
            beauty experiences through four specialised AI systems working together.
          </p>
        </div>

        {/* Feature Cards */}
        {features.map((f, i) => (
          <div key={i} style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '18px', padding: '1.75rem', marginBottom: '1rem',
            display: 'grid', gridTemplateColumns: '1fr auto',
            gap: '1.5rem', alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div>
              {/* Icon + Tag + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.9rem' }}>{f.icon}</span>
                <div>
                  <div style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--gold-dark)', textTransform: 'uppercase',
                    background: 'var(--gold-light)', padding: '0.2rem 0.55rem',
                    borderRadius: '4px', display: 'inline-block', marginBottom: '0.3rem',
                  }}>
                    {f.tag}
                  </div>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.25rem', fontWeight: 600, color: 'var(--charcoal)',
                  }}>
                    {f.title}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.9rem', color: 'var(--muted)',
                lineHeight: 1.8, marginBottom: '1rem',
              }}>
                {f.desc}
              </p>

              {/* RevenuePilot live impact callout */}
              {f.title === 'RevenuePilot AI' && (
                <div style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '10px', padding: '0.9rem', marginBottom: '1rem',
                }}>
                  <div style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: 'var(--gold-dark)', letterSpacing: '0.08em', marginBottom: '0.35rem',
                  }}>
                    LIVE IMPACT EXAMPLE
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                    Occupancy: 32% → Flash Campaign →
                    <strong> +₹5,400 Revenue</strong>
                  </div>
                </div>
              )}

              {/* Metric Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {f.metrics.map(metric => (
                  <span key={metric} style={{
                    fontSize: '0.72rem', fontWeight: 600,
                    background: 'var(--cream)', color: 'var(--charcoal)',
                    padding: '0.25rem 0.65rem', borderRadius: '20px',
                    border: '1px solid var(--border)',
                  }}>
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Explore Button — identical for all 4 ── */}
            <button
              onClick={() => navigate(f.path)}
              style={exploreBtn}
              onMouseOver={e => e.currentTarget.style.background = '#333'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--charcoal)'}
            >
              Explore →
            </button>
          </div>
        ))}

        {/* Bottom Pitch */}
        <div style={{
          background: 'var(--charcoal)', borderRadius: '18px',
          padding: '3rem 2rem', textAlign: 'center', marginTop: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem', fontWeight: 600,
            color: 'var(--white)', marginBottom: '1rem', lineHeight: 1.4,
          }}>
            Most beauty platforms optimise bookings.<br />
            <span style={{ color: 'var(--gold)' }}>
              StyleSync AI optimises revenue, retention, and customer outcomes.
            </span>
          </div>
          <p style={{
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 2rem',
          }}>
            An AI-powered operating system helping beauty businesses increase
            revenue while delivering better customer outcomes through intelligent
            forecasting, personalised styling, communication automation, and
            beauty intelligence.
          </p>
          <button
            onClick={() => navigate('/revenue-pilot')}
            style={{
              background: 'var(--gold)', color: 'var(--white)',
              border: 'none', padding: '0.85rem 2rem',
              borderRadius: '10px', fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--gold-dark)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--gold)'}
          >
            See RevenuePilot in Action →
          </button>
        </div>

      </div>
    </div>
  )
}