import React from 'react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '+31.7%', label: 'Average Revenue Increase' },
  { value: '₹26,000', label: 'Extra Monthly Revenue' },
  { value: '4', label: 'Specialized AI Systems' },
]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '85vh' }}>

      {/* HERO */}
      <div
        className="fade-up"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '5rem 2rem 4rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'center',
          }}
        >

          {/* LEFT */}
          <div>

            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              AI Revenue Intelligence For Beauty Businesses
            </div>

            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4.3rem)',
                fontWeight: 600,
                color: 'var(--charcoal)',
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                marginBottom: '1.5rem',
              }}
            >
              Most beauty platforms stop
              <br />
              after the booking.
              <br />
              <span style={{ color: 'var(--gold)' }}>
                We start there.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--muted)',
                maxWidth: '580px',
                lineHeight: 1.8,
                marginBottom: '2rem',
              }}
            >
              StyleSync AI helps salons turn idle capacity into
              predictable revenue while helping customers make
              smarter beauty decisions through AI-powered
              recommendations, style intelligence, and revenue
              forecasting.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => navigate('/revenue-pilot')}
                className="pulse-gold"
                style={{
                  background: 'var(--charcoal)',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                See RevenuePilot AI →
              </button>

              <button
                onClick={() => navigate('/style-match')}
                style={{
                  background: 'transparent',
                  color: 'var(--charcoal)',
                  border: '1px solid var(--border)',
                  padding: '0.9rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try StyleMatch
              </button>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div>
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '1.8rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--gold-dark)',
                  marginBottom: '1rem',
                }}
              >
                REVENUEPILOT PREVIEW
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--muted)',
                    marginBottom: '0.3rem',
                  }}
                >
                  Predicted Occupancy
                </div>

                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--charcoal)',
                  }}
                >
                  32%
                </div>
              </div>

              <div
                style={{
                  background: 'var(--cream)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--gold-dark)',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                  }}
                >
                  RECOMMENDED CAMPAIGN
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                  }}
                >
                  15% Hair Spa Flash Deal
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--muted)',
                    }}
                  >
                    Expected Bookings
                  </div>

                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--charcoal)',
                    }}
                  >
                    +7
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--muted)',
                    }}
                  >
                    Revenue Impact
                  </div>

                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--gold-dark)',
                    }}
                  >
                    +₹5,400
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 2rem 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                color: 'var(--gold-dark)',
                marginBottom: '0.4rem',
              }}
            >
              {s.value}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* PROBLEM */}
      <div
        style={{
          background: 'var(--charcoal)',
          padding: '4rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: 'var(--gold)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            The Problem
          </div>

          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              textAlign: 'center',
              color: 'white',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              lineHeight: 1.3,
              marginBottom: '2rem',
            }}
          >
            An empty salon chair generates
            <br />
            <span style={{ color: 'var(--gold)' }}>
              exactly zero revenue.
            </span>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              {
                icon: '📉',
                title: 'Perishable Inventory',
                desc: 'Every empty appointment slot is revenue that can never be recovered.',
              },
              {
                icon: '📣',
                title: 'Limited Marketing Tools',
                desc: 'Most independent salons lack forecasting and campaign optimisation tools.',
              },
              {
                icon: '🎯',
                title: 'Bookings ≠ Growth',
                desc: 'Existing platforms focus on appointments, not business outcomes.',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                  {item.icon}
                </div>

                <div
                  style={{
                    color: 'white',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.7,
                    fontSize: '0.85rem',
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOLUTION */}
      <div
        style={{
          background: 'var(--ivory)',
          padding: '4rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            The Solution
          </div>

          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              color: 'var(--charcoal)',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              lineHeight: 1.3,
              marginBottom: '1rem',
            }}
          >
            StyleSync AI is a Revenue OS
            <br />
            for beauty businesses.
          </h2>

          <p
            style={{
              color: 'var(--muted)',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: 1.8,
            }}
          >
            Four specialised AI systems work together to forecast
            demand, personalise beauty recommendations, translate
            inspiration into stylist-ready instructions, and help
            salons maximise every appointment slot.
          </p>

          <button
            onClick={() => navigate('/revenue-pilot')}
            style={{
              background: 'var(--gold)',
              color: 'white',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Explore RevenuePilot →
          </button>
        </div>
      </div>

    </div>
  )
}
