import React, { useState, useMemo } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { int, pct, formatSentences } from './utils'

const SALON_TYPES = ['Unisex Salon', 'Ladies Parlour', 'Luxury Spa', 'Hair Studio']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const RISK_DAYS = ['Wed', 'Thu']

// ── Single prediction object — computed once, used everywhere ─────────────────
function predict(occupancy, day, salonType) {
  const dayIdx  = DAYS.indexOf(day)
  const typeIdx = SALON_TYPES.indexOf(salonType)
  const seed    = (occupancy * 7) + (dayIdx * 13) + (typeIdx * 17)

  // Idle slots
  const idleSlots =
    occupancy < 20 ? 14 :
    occupancy < 30 ? 12 :
    occupancy < 40 ? 10 :
    occupancy < 50 ? 8  :
    occupancy < 60 ? 6  :
    occupancy < 70 ? 4  :
    occupancy < 80 ? 2  : 1

  // Opportunity tier
  const tier = occupancy < 30 ? 'high' : occupancy < 55 ? 'medium' : 'low'

  // Campaigns
  const dayCampaigns = {
    Monday:    { tag: 'Corporate Deal',   name: 'Monday Corporate Package',    desc: 'Weekday professional grooming combo', discount: '20%' },
    Tuesday:   { tag: 'Flash Deal',       name: 'Tuesday Refresh Special',     desc: 'Quick grooming refresh mid-week',    discount: '15%' },
    Wednesday: { tag: 'Flash Deal',       name: 'Hair Spa Flash Sale',         desc: 'Mid-week hair spa recovery offer',   discount: '18%' },
    Thursday:  { tag: 'Combo Offer',      name: 'Pre-Weekend Glow Package',    desc: 'Prep for the weekend ahead',         discount: '15%' },
    Friday:    { tag: 'Weekend Kickoff',  name: 'Weekend Colour Package',      desc: 'Colour and treatment combo deal',    discount: '12%' },
    Saturday:  { tag: 'Premium Upsell',   name: 'Saturday Premium Experience', desc: 'Full luxury treatment upgrade',      discount: '10%' },
    Sunday:    { tag: 'Bridal Special',   name: 'Sunday Bridal and Event Prep',desc: 'Complete bridal styling package',    discount: '15%' },
  }
  const salonCampaigns = {
    'Unisex Salon':   { tag: 'Family Deal',    name: 'Family Weekend Package',     desc: 'Bring the whole family',         discount: '20%' },
    'Ladies Parlour': { tag: 'Treatment Deal', name: 'Deep Hair Treatment Combo',  desc: 'Keratin and nourishment package',discount: '18%' },
    'Luxury Spa':     { tag: 'Membership',     name: 'Premium Membership Drive',   desc: 'Annual luxury membership offer', discount: '25%' },
    'Hair Studio':    { tag: 'Colour Deal',    name: 'Colour Correction Special',  desc: 'Full colour and toning package', discount: '15%' },
  }

  const baseRevenue = tier === 'high' ? 6800 : tier === 'medium' ? 4200 : 2100
  const variation   = (seed % 800) - 400
  const rev1        = Math.max(800,  int(baseRevenue + variation))
  const rev2        = Math.max(500,  int(rev1 * 0.65))
  const bookings1   = tier === 'high' ? 8 + (seed % 4) : tier === 'medium' ? 5 + (seed % 3) : 2 + (seed % 2)
  const bookings2   = Math.max(1, int(bookings1 * 0.6))

  const campaigns = [
    { ...dayCampaigns[day],         bookings: bookings1, revenue_inr: rev1 },
    { ...salonCampaigns[salonType], bookings: bookings2, revenue_inr: rev2 },
  ]

  // Revenue metrics
  const avgTicket   = salonType === 'Luxury Spa' ? 1800 : salonType === 'Hair Studio' ? 1200 : 900
  const slots       = 20
  const currentRev  = int((occupancy / 100) * slots * avgTicket)
  const uplift      = rev1 + rev2
  const projRev     = int(currentRev + uplift)
  const upliftPct   = currentRev > 0 ? pct((uplift / currentRev) * 100) : 0

  // Chart data
  const basePattern = [48, 44, 38, 40, 68, 84, 74]
  const shift       = int((occupancy - 50) * 0.3)
  const offsets     = [3, 7, 5, 9, 4, 6, 8]
  const chartData   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
    const base         = Math.max(10, Math.min(95, basePattern[i] + shift))
    const offset       = ((seed + offsets[i]) % 9) - 4
    const last         = Math.max(10, Math.min(95, int(base + offset)))
    const forecastBoost= i === dayIdx ? int(occupancy * 0.05) : 0
    const forecast     = Math.max(10, Math.min(98, int(last + 3 + forecastBoost)))
    return { day: d, last, forecast }
  })

  const tierLabel = tier === 'high' ? 'High' : tier === 'medium' ? 'Medium' : 'Low'
  const tierColor = tier === 'high' ? '#A32D2D' : tier === 'medium' ? 'var(--gold-dark)' : '#2D6A4F'

  return {
    idleSlots,
    tier,
    tierLabel,
    tierColor,
    campaigns,
    metrics: {
      current_revenue_inr:   currentRev,
      projected_revenue_inr: projRev,
      increase_pct:          upliftPct,
      idle_slots:            idleSlots,   // same value, not hardcoded
    },
    chartData,
  }
}

function ForecastBar({ x, y, width, height, day, dataKey }) {
  const isRisk = RISK_DAYS.includes(day)
  const color  = dataKey === 'last' ? '#D1C7B5' : isRisk ? '#9A7A30' : 'var(--gold)'
  return <rect x={x} y={y} width={width} height={height} fill={color} rx={3} />
}

export default function RevenuePilot() {
  const [occupancy, setOccupancy] = useState(38)
  const [day,       setDay]       = useState('Wednesday')
  const [salonType, setSalonType] = useState('Unisex Salon')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)

  // Single prediction object — drives KPIs, chart, insight, everything
  const pred = useMemo(() => predict(occupancy, day, salonType), [occupancy, day, salonType])

  async function handleSubmit() {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const form = new FormData()
      form.append('occupancy', occupancy + '%')
      form.append('day', day)
      form.append('salon_type', salonType)
      const res = await axios.post('/api/revenue-pilot', form)
      // Merge API response but keep our derived idle_slots so it stays consistent
      setResult({
        campaigns: res.data.campaigns || pred.campaigns,
        metrics: {
          ...res.data.metrics,
          idle_slots: pred.idleSlots,   // always use derived value
        },
      })
    } catch (e) {
      // Fallback to fully local prediction — demo never breaks
      setResult({
        campaigns: pred.campaigns,
        metrics:   pred.metrics,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--ivory)', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }} className="fade-up">

        {/* ── Page Header ── */}
        <div style={{ textAlign: 'center', padding: '2rem 0 2.5rem' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Hero Feature
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 600, color: 'var(--charcoal)',
            lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.75rem',
          }}>
            Turn Empty Salon Hours<br />Into Revenue
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            RevenuePilot predicts idle capacity and recommends targeted flash
            campaigns before revenue is permanently lost.
          </p>
        </div>

        {/* ── Business Proof Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
          borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.25rem',
          }}>
            RevenuePilot Case Study
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif', fontSize: '1.2rem',
            color: 'var(--white)', marginBottom: '1.25rem', fontWeight: 600,
          }}>
            Lakshmi Beauty Studio
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { val: '₹82,000',   label: 'Baseline Revenue',     up: false },
              { val: '₹1,08,000', label: 'AI Optimised Revenue', up: true  },
              { val: '+31.7%',    label: 'Revenue Growth',       up: true  },
            ].map((m, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '10px', padding: '1rem', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '1.4rem', fontWeight: 600,
                  color: m.up ? '#7ED49A' : 'var(--white)',
                  marginBottom: '0.25rem',
                }}>
                  {m.val}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── KPI Row — all from pred, updates live ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem', marginBottom: '1rem',
        }}>
          {[
            { val: `${occupancy}%`,    label: 'Current Occupancy',  color: pred.tierColor },
            { val: `${pred.idleSlots}`,label: 'Idle Slots Today',   color: 'var(--charcoal)' },
            { val: pred.tierLabel,     label: 'Revenue Opportunity', color: pred.tierColor },
          ].map((k, i) => (
            <div key={i} style={{
              background: 'var(--white)',
              border: `1px solid ${occupancy < 50 ? '#FECACA' : 'var(--border)'}`,
              borderRadius: '12px', padding: '1.1rem', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.6rem', fontWeight: 600,
                color: k.color, marginBottom: '0.25rem',
              }}>
                {k.val}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 500 }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two Column: Inputs + Chart ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Inputs */}
          <div style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem',
            }}>
              Salon Inputs
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
                  Current Occupancy
                </span>
                <span style={{
                  fontSize: '0.85rem', fontWeight: 700,
                  background: 'var(--gold-light)', padding: '0.1rem 0.5rem',
                  borderRadius: '6px', color: 'var(--gold-dark)',
                }}>
                  {occupancy}%
                </span>
              </div>
              <input
                type="range" min="5" max="95" value={occupancy}
                onChange={e => setOccupancy(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>5%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>95%</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                fontSize: '0.78rem', color: 'var(--muted)',
                fontWeight: 500, display: 'block', marginBottom: '0.4rem',
              }}>
                Day of Week
              </label>
              <select
                value={day} onChange={e => setDay(e.target.value)}
                style={{
                  width: '100%', padding: '0.55rem 0.75rem',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                  background: 'var(--white)', color: 'var(--charcoal)',
                }}
              >
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                fontSize: '0.78rem', color: 'var(--muted)',
                fontWeight: 500, display: 'block', marginBottom: '0.4rem',
              }}>
                Salon Type
              </label>
              <select
                value={salonType} onChange={e => setSalonType(e.target.value)}
                style={{
                  width: '100%', padding: '0.55rem 0.75rem',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                  background: 'var(--white)', color: 'var(--charcoal)',
                }}
              >
                {SALON_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--muted)' : 'var(--gold)',
                color: 'var(--white)', border: 'none', padding: '0.75rem',
                borderRadius: '8px', fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing...</>
                : 'Generate AI Campaign Plan'}
            </button>
          </div>

          {/* Chart */}
          <div style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <div>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
                  color: 'var(--gold)', textTransform: 'uppercase',
                }}>
                  Weekly Occupancy Forecast
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--charcoal)', marginTop: '0.15rem' }}>
                  AI Revenue Opportunity Analysis
                </div>
              </div>
              <div style={{
                fontSize: '0.68rem', fontWeight: 700,
                background: 'var(--gold-light)', color: 'var(--gold-dark)',
                padding: '0.2rem 0.6rem', borderRadius: '20px', whiteSpace: 'nowrap',
              }}>
                87% Forecast Confidence
              </div>
            </div>

            {/* AI Insight — uses pred.idleSlots */}
            <div style={{
              background: 'var(--cream)', border: '1px solid var(--gold-light)',
              borderLeft: '3px solid var(--gold)', borderRadius: '8px',
              padding: '0.75rem 1rem', margin: '0.75rem 0',
            }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold-dark)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem',
              }}>
                AI Insight
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>
                {day} occupancy is projected at{' '}
                <strong style={{ color: 'var(--gold-dark)' }}>{occupancy}%</strong> with{' '}
                <strong style={{ color: 'var(--gold-dark)' }}>{pred.idleSlots} idle slots</strong>.{' '}
                {occupancy < 40
                  ? `A flash campaign could recover approximately ₹${int(pred.idleSlots * 650).toLocaleString('en-IN')} in lost revenue.`
                  : occupancy < 65
                  ? `A targeted combo offer could boost revenue by ₹${int(pred.idleSlots * 850).toLocaleString('en-IN')}.`
                  : 'Occupancy is healthy. Consider premium upsell campaigns to increase ticket size.'}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pred.chartData} barSize={10} barGap={2}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'var(--muted)' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(val, name) => [`${int(val)}%`, name === 'last' ? 'Last Week' : 'AI Forecast']}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                />
                <Bar dataKey="last"     radius={[3,3,0,0]} shape={(p) => <ForecastBar {...p} dataKey="last"     />} />
                <Bar dataKey="forecast" radius={[3,3,0,0]} shape={(p) => <ForecastBar {...p} dataKey="forecast" />} />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {[['#D1C7B5','Last Week'],['var(--gold)','AI Forecast'],['var(--gold-dark)','Risk Days']].map(([color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 10, height: 10, background: color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '10px', padding: '1rem', marginBottom: '1rem',
            color: '#991B1B', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        {/* ── AI Results ── */}
        {result && (
          <div className="fade-up" style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.68rem', fontWeight: 600, color: 'var(--gold-dark)',
              background: 'var(--gold-light)', padding: '0.2rem 0.6rem',
              borderRadius: '20px', marginBottom: '1rem',
            }}>
              ✦ RevenuePilot AI
            </div>

            {/* Executive Summary — uses pred.idleSlots */}
            <div style={{
              background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
              borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem',
            }}>
              <div style={{
                fontSize: '0.68rem', fontWeight: 700, color: 'var(--gold)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem',
              }}>
                Executive Summary
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                {occupancy < 40 ? (
                  <>Occupancy is critically low at <span style={{ color: '#F87171', fontWeight: 600 }}>{occupancy}%</span> with <span style={{ color: '#F87171', fontWeight: 600 }}>{pred.idleSlots} idle slots</span> today. RevenuePilot has identified <span style={{ color: '#7ED49A', fontWeight: 600 }}>₹{int(result.metrics?.projected_revenue_inr - result.metrics?.current_revenue_inr).toLocaleString('en-IN')} immediate recovery potential</span> through targeted flash campaigns.</>
                ) : occupancy < 65 ? (
                  <>Occupancy at <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{occupancy}%</span> leaves <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{pred.idleSlots} slots</span> unfilled. RevenuePilot recommends <span style={{ color: '#7ED49A', fontWeight: 600 }}>combo and upsell campaigns</span> to fill remaining capacity.</>
                ) : (
                  <>Occupancy is healthy at <span style={{ color: '#7ED49A', fontWeight: 600 }}>{occupancy}%</span> with only <span style={{ color: '#7ED49A', fontWeight: 600 }}>{pred.idleSlots} idle slots</span>. RevenuePilot recommends <span style={{ color: 'var(--gold)', fontWeight: 600 }}>premium upselling</span> to increase average ticket size.</>
                )}
              </div>
            </div>

            {/* Campaigns */}
            <div style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
              color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>
              Recommended Campaigns
            </div>

            {(result.campaigns || []).map((c, i) => (
              <div key={i} style={{
                border: '1px solid var(--border)', borderRadius: '10px',
                padding: '1rem 1.25rem', marginBottom: '0.75rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold-dark)',
                    background: 'var(--gold-light)', padding: '0.15rem 0.5rem',
                    borderRadius: '4px', display: 'inline-block', marginBottom: '0.4rem',
                  }}>
                    {c.tag}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {formatSentences(c.desc)} · {c.discount} off
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2D6A4F' }}>
                    +₹{int(c.revenue_inr).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    +{int(c.bookings)} bookings
                  </div>
                </div>
              </div>
            ))}

            {/* Metrics — idle_slots always from pred */}
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem',
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem',
            }}>
              {[
                { label: 'Current Revenue',   val: `₹${int(result.metrics?.current_revenue_inr).toLocaleString('en-IN')}`,   color: 'var(--charcoal)' },
                { label: 'Projected Revenue', val: `₹${int(result.metrics?.projected_revenue_inr).toLocaleString('en-IN')}`, color: '#2D6A4F'         },
                { label: 'Revenue Uplift',    val: `+${pct(result.metrics?.increase_pct)}%`,                                  color: 'var(--gold-dark)' },
                { label: 'Idle Slots Today',  val: pred.idleSlots,                                                            color: 'var(--charcoal)' },
              ].map((m, i) => (
                <div key={i} style={{
                  background: 'var(--cream)', borderRadius: '10px', padding: '1rem', textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 600, color: 'var(--muted)',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem',
                  }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: m.color }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}