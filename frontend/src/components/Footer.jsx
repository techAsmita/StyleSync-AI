import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{
      background: 'var(--charcoal)',
      padding: '4.5rem 3rem 2.5rem',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '3rem',
          alignItems: 'start',
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.6rem',
              fontWeight: 600,
              color: 'var(--white)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              Style<span style={{ color: 'var(--gold)' }}>Sync</span> AI
            </div>
            <p style={{
              fontSize: '0.88rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.85,
              maxWidth: '320px',
              marginBottom: '1.25rem',
            }}>
              An AI-powered revenue intelligence platform helping beauty businesses
              increase occupancy, improve customer outcomes, and turn idle capacity
              into predictable growth.
            </p>
            <div style={{
              display: 'inline-block',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.22)',
              color: 'var(--gold)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.73rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}>
              Revenue OS for Beauty Businesses
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.13em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Product
            </div>
            {[
              { label: 'RevenuePilot AI',     path: '/revenue-pilot' },
              { label: 'AI StyleMatch',        path: '/style-match'   },
              { label: 'Look Transfer',        path: '/look-transfer' },
              { label: 'Beauty Intelligence',  path: '/beauty-intel'  },
              { label: 'Platform Overview',    path: '/features'      },
            ].map(item => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: '0.86rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '0.8rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Platform */}
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.13em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Platform
            </div>
            {[
              'Occupancy Forecasting',
              'Revenue Intelligence',
              'Beauty Analysis',
              'Style Recommendations',
              'AI-Powered Insights',
              'Customer Retention',
            ].map(item => (
              <div key={item} style={{
                fontSize: '0.86rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '0.8rem',
                lineHeight: 1.5,
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.01em',
          }}>
            © 2026 StyleSync AI • Built for Buildathon 2026
          </div>
          <div style={{
            fontSize: '0.73rem',
            background: 'rgba(201,168,76,0.1)',
            color: 'var(--gold)',
            border: '1px solid rgba(201,168,76,0.22)',
            padding: '0.3rem 0.85rem',
            borderRadius: '20px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            4 AI Systems Working Together
          </div>
        </div>
      </div>
    </footer>
  )
}