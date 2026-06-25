import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Home',                 path: '/' },
  { label: 'RevenuePilot',         path: '/revenue-pilot' },
  { label: 'StyleMatch',           path: '/style-match' },
  { label: 'Look Transfer',        path: '/look-transfer' },
  { label: 'Beauty Intelligence',  path: '/beauty-intel' },
  { label: 'Features',             path: '/features' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(250,250,248,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '64px',
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--charcoal)',
          cursor: 'pointer',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        Style<span style={{ color: 'var(--gold)' }}>Sync</span> AI
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                padding: '0.4rem 0.85rem',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: active ? 'var(--charcoal)' : 'transparent',
                color: active ? 'var(--white)' : 'var(--muted)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Badge */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 600,
        background: 'var(--gold-light)',
        color: 'var(--gold-dark)',
        padding: '0.2rem 0.6rem',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
      }}>
        Beta
      </div>

    </nav>
  )
}