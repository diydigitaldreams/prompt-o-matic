import { useState, useRef, useCallback } from 'react'
import { buildSystemPrompt, RATING_COLORS } from './knowledgeBase.js'

const KEYFRAMES = `
@keyframes cratefall {
  0%   { transform: translateY(-120px) rotate(-3deg); opacity: 0; }
  60%  { transform: translateY(8px) rotate(1deg); opacity: 1; }
  75%  { transform: translateY(-4px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
}
@keyframes sparkle {
  0%,100% { opacity:1; transform: scale(1) rotate(0deg); }
  50%      { opacity:0.6; transform: scale(1.3) rotate(180deg); }
}
@keyframes scrollunroll {
  from { max-height: 0; opacity: 0; }
  to   { max-height: 2000px; opacity: 1; }
}
@keyframes plungerpush {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.88) translateY(4px); }
  100% { transform: scale(1); }
}
@keyframes ultrablackpulse {
  0%,100% { box-shadow: 0 0 20px #7c4dff, 0 0 40px #7c4dff; }
  50%      { box-shadow: 0 0 50px #7c4dff, 0 0 100px #7c4dff, 0 0 150px #3d00ff; }
}
@keyframes starspin {
  0%   { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes blink {
  0%,100% { opacity:1; } 50% { opacity:0; }
}
@keyframes shake {
  0%,100% { transform:translateX(0); }
  20%      { transform:translateX(-6px); }
  40%      { transform:translateX(6px); }
  60%      { transform:translateX(-4px); }
  80%      { transform:translateX(4px); }
}
@keyframes fadeup {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0); }
}
`

function StarBurst() {
  return (
    <div style={{
      position:'absolute', top:'50%', left:'50%',
      width:'200px', height:'200px', pointerEvents:'none',
      animation: 'starspin 3s linear infinite', zIndex: 0,
    }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position:'absolute', top:'50%', left:'50%',
          width:'4px', height:'80px',
          background:'linear-gradient(to top, transparent, #7c4dff)',
          transformOrigin: 'bottom center',
          transform: `rotate(${i * 45}deg) translateX(-50%)`,
          animation: `sparkle ${0.5 + i * 0.1}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

function RatingBadge({ rating, score }) {
  const colors = RATING_COLORS[rating] || RATING_COLORS.GREEN
  const isUltra = rating === 'ULTRABLACK'
  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding: '16px 32px',
      background: colors.bg,
      border: `3px solid ${colors.glow}`,
      borderRadius: '8px',
      boxShadow: isUltra
        ? `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`
        : `0 4px 20px ${colors.glow}66`,
      animation: isUltra ? 'ultrablackpulse 2s ease-in-out infinite' : 'none',
      minWidth: '160px', overflow: 'hidden',
    }}>
      {isUltra && <StarBurst />}
      <div style={{
        position:'relative', zIndex:1,
        fontFamily:'Bangers, cursive', fontSize:'2rem',
        color: colors.text, letterSpacing:'3px',
        textShadow: isUltra ? `0 0 10px ${colors.glow}` : 'none',
      }}>
        {colors.emoji} {rating}
      </div>
      <div style={{
        position:'relative', zIndex:1,
        fontFamily:'Share Tech Mono, monospace', fontSize:'1.4rem',
        color: colors.text, opacity: 0.9,
      }}>
        {score}/100
      </div>
    </div>
  )
}

function AcmeCrate({ children, visible }) {
  if (!visible) return null
  return (
    <div style={{
      animation: 'cratefall 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      background: '#1a1a1a', border: '4px solid #cc0000',
      borderRadius: '4px', padding: '24px', position: 'relative',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
    }}>
      <div style={{
        position:'absolute', top:'-14px', left:'50%', transform:'translateX(-50%)',
        background:'#cc0000', color:'#fff',
        fontFamily:'Bangers, cursive', fontSize:'0.9rem',
        letterSpacing:'2px', padding:'2px 16px', borderRadius:'3px',
        whiteSpace:'nowrap',
      }}>
        ☠ ACME ANALYSIS RESULT ☠
      </div>
      {children}
    </div>
  )
}

function TntButton({ onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: loading ? '#333' : 'linear-gradient(180deg, #cc0000 0%, #990000 100%)',
        border: '3px solid #ff0000', borderRadius: '8px',
        color: '#fff', fontFamily: 'Bangers, cursive',
        fontSize: '1.4rem', letterSpacing: '3px',
        padding: '14px 40px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        animation: loading ? 'blink 0.8s ease-in-out infinite' : 'none',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(204,0,0,0.5)',
        transition: 'all 0.15s',
        display: 'flex', alignItems:'center', gap:'10px',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseDown={e => { if (!disabled && !loading) e.currentTarget.style.animation = 'plungerpush 0.3s ease forwards' }}
      onMouseUp={e => { e.currentTarget.style.animation = 'none' }}
    >
      <span style={{fontSize:'1.6rem'}}>🧨</span>
      {loading ? 'ANALYZING...' : 'DETONATE ANALYSIS'}
      <div style={{fontSize:'0.65rem', opacity:0.7, marginLeft:'4px'}}>
        {!loading && '(results may vary)'}
      </div>
    </button>
  )
}

function LogScroll({ logs }) {
  if (logs.length === 0) return null
  return (
    <div style={{
      background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d5a3 100%)',
      border: '3px solid #8b6914', borderRadius: '4px',
      padding: '20px', animation: 'scrollunroll 0.4s ease-out',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        fontFamily:'Bangers, cursive', fontSize:'1.3rem',
        color:'#3d1c00', letterSpacing:'2px', marginBottom:'12px',
        borderBottom:'2px solid #8b6914', paddingBottom:'8px',
      }}>
        📜 OPERATION LOG — {logs.length} PAYLOAD{logs.length !== 1 ? 'S' : ''} ANALYZED
      </div>
      {logs.map((log, i) => (
        <div key={i} style={{
          display:'flex', gap:'12px', alignItems:'flex-start',
          padding:'10px 0',
          borderBottom: i < logs.length - 1 ? '1px solid #c4a35a' : 'none',
          animation: 'fadeup 0.3s ease',
        }}>
          <div style={{
            fontFamily:'Bangers, cursive', fontSize:'1rem',
            color: RATING_COLORS[log.rating]?.bg || '#000',
            minWidth:'110px', background: '#00000011',
            padding:'2px 8px', borderRadius:'3px', textAlign:'center',
          }}>
            {RATING_COLORS[log.rating]?.emoji} {log.rating}
          </div>
          <div style={{flex:1}}>
            <div style={{
              fontFamily:'Share Tech Mono, monospace',
              fontSize:'0.75rem', color:'#3d1c00',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              maxWidth:'400px',
            }}>
              {log.payload.slice(0, 80)}{log.payload.length > 80 ? '...' : ''}
            </div>
            <div style={{
              fontFamily:'Patrick Hand, cursive',
              fontSize:'0.7rem', color:'#7a5c00', marginTop:'2px',
            }}>
              Score: {log.score}/100 · {log.pattern_family} · {log.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalysisDisplay({ result }) {
  if (!result) return null
  const colors = RATING_COLORS[result.rating] || RATING_COLORS.GREEN

  const Section = ({ title, children }) => (
    <div style={{marginBottom:'16px'}}>
      <div style={{
        fontFamily:'Bangers, cursive', fontSize:'0.9rem',
        letterSpacing:'2px', color:'#ff4444', marginBottom:'6px',
      }}>
        ▸ {title}
      </div>
      {children}
    </div>
  )

  const Tag = ({ text, color }) => (
    <span style={{
      display:'inline-block', padding:'3px 10px', borderRadius:'3px',
      background: color || '#2a2a2a', border:'1px solid #444',
      fontFamily:'Share Tech Mono, monospace', fontSize:'0.75rem',
      color:'#ccc', margin:'2px',
    }}>
      {text}
    </span>
  )

  return (
    <div style={{animation:'fadeup 0.4s ease'}}>
      <div style={{
        display:'flex', gap:'20px', alignItems:'center',
        marginBottom:'24px', flexWrap:'wrap',
      }}>
        <RatingBadge rating={result.rating} score={result.score} />
        <div>
          <div style={{
            fontFamily:'Bangers, cursive', fontSize:'1.2rem',
            color:'#aaa', letterSpacing:'1px',
          }}>
            {result.attack_type} INJECTION
          </div>
          <div style={{
            fontFamily:'Share Tech Mono, monospace',
            fontSize:'0.85rem', color:'#ff8844',
          }}>
            {result.pattern_family}
          </div>
          <div style={{
            fontFamily:'Patrick Hand, cursive',
            fontSize:'0.85rem', color:'#999', marginTop:'4px',
          }}>
            Detection probability: {result.detection_probability}
          </div>
        </div>
      </div>

      <Section title="LAYERS BYPASSED">
        {(result.defense_layers_bypassed || []).map((l, i) =>
          <Tag key={i} text={`✓ ${l}`} color='#1a3a1a' />
        )}
      </Section>

      <Section title="LAYERS TRIGGERED">
        {(result.defense_layers_triggered || []).map((l, i) =>
          <Tag key={i} text={`✗ ${l}`} color='#3a1a1a' />
        )}
      </Section>

      <Section title="STRENGTHS">
        {(result.strengths || []).map((s, i) => (
          <div key={i} style={{
            fontFamily:'Patrick Hand, cursive', fontSize:'0.9rem',
            color:'#88cc88', padding:'2px 0',
          }}>
            + {s}
          </div>
        ))}
      </Section>

      <Section title="WEAKNESSES">
        {(result.weaknesses || []).map((w, i) => (
          <div key={i} style={{
            fontFamily:'Patrick Hand, cursive', fontSize:'0.9rem',
            color:'#cc8888', padding:'2px 0',
          }}>
            − {w}
          </div>
        ))}
      </Section>

      <Section title="IMPROVED PAYLOAD">
        <div style={{
          background:'#0a0a0a', border:'1px solid #333',
          borderRadius:'4px', padding:'12px',
          fontFamily:'Share Tech Mono, monospace',
          fontSize:'0.8rem', color:'#7cf',
          whiteSpace:'pre-wrap', wordBreak:'break-word',
        }}>
          {result.improvement}
        </div>
        <div style={{
          fontFamily:'Patrick Hand, cursive', fontSize:'0.82rem',
          color:'#999', marginTop:'6px', fontStyle:'italic',
        }}>
          Rationale: {result.improvement_rationale}
        </div>
      </Section>

      {result.competition_notes && (
        <Section title="COMPETITION INTEL">
          <div style={{
            fontFamily:'Patrick Hand, cursive', fontSize:'0.88rem',
            color:'#cc99ff', background:'#1a0a2a',
            border:'1px solid #4a2a6a', borderRadius:'4px', padding:'10px',
          }}>
            {result.competition_notes}
          </div>
        </Section>
      )}

      <div style={{
        background: `${colors.bg}22`,
        border: `1px solid ${colors.glow}44`,
        borderRadius:'4px', padding:'12px', marginTop:'8px',
        fontFamily:'Patrick Hand, cursive', fontSize:'0.92rem',
        color:'#ddd', fontStyle:'italic',
      }}>
        💬 {result.analyst_commentary}
      </div>
    </div>
  )
}

function generateReport(logs) {
  const lines = [
    '╔══════════════════════════════════════════════════════════════╗',
    '║          ACME PROMPT-O-MATIC™ — OPERATION REPORT            ║',
    '║              AI Red Team Payload Analysis Log                ║',
    `║         Generated: ${new Date().toLocaleString().padEnd(39)}║`,
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    `TOTAL PAYLOADS ANALYZED: ${logs.length}`,
    `HIGH-THREAT (RED+): ${logs.filter(l => ['RED','BLACK','ULTRABLACK'].includes(l.rating)).length}`,
    `AVG SCORE: ${logs.length > 0 ? Math.round(logs.reduce((a, b) => a + b.score, 0) / logs.length) : 0}/100`,
    '',
    '═══════════════════════════════════════════════════════════════',
    'PAYLOAD DETAIL LOG',
    '═══════════════════════════════════════════════════════════════',
    '',
  ]

  logs.forEach((log, i) => {
    lines.push(`[${i+1}] ${log.rating} — Score: ${log.score}/100`)
    lines.push(`    Pattern: ${log.pattern_family}`)
    lines.push(`    Type: ${log.attack_type}`)
    lines.push(`    Time: ${log.timestamp}`)
    lines.push(`    Payload: ${log.payload.slice(0, 120)}${log.payload.length > 120 ? '...' : ''}`)
    if (log.improvement) {
      lines.push(`    Improved: ${log.improvement.slice(0, 120)}${log.improvement.length > 120 ? '...' : ''}`)
    }
    lines.push('')
  })

  lines.push('═══════════════════════════════════════════════════════════════')
  lines.push('END OF REPORT — ACME CORP CONFIDENTIAL')

  const win = window.open('', '_blank')
  win.document.write(`<pre style="font-family:monospace;font-size:13px;padding:24px;background:#000;color:#00ff00;white-space:pre-wrap">${lines.join('\n')}</pre>`)
  win.document.title = 'ACME Prompt-O-Matic Report'
  setTimeout(() => win.print(), 500)
}

export default function PromptOMatic() {
  const [constraints, setConstraints] = useState('')
  const [payload, setPayload]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)
  const [logs, setLogs]               = useState([])
  const [showLog, setShowLog]         = useState(false)
  const abortRef                      = useRef(null)

  const analyze = useCallback(async () => {
    if (!payload.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    abortRef.current = new AbortController()

    const messages = [{
      role: 'user',
      content: `CHALLENGE CONSTRAINTS:\n${constraints || 'None specified'}\n\nPAYLOAD TO ANALYZE:\n${payload}`,
    }]

    try {
      const res = await fetch('/api/anthropic-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: buildSystemPrompt(),
          messages,
        }),
      })

      const data = await res.json()
      if (data.error) { setError(data.error.message); return }

      const raw = data.content?.[0]?.text || ''
      let parsed
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      } catch {
        setError('Claude returned non-JSON response. Try again.')
        return
      }

      setResult(parsed)
      setLogs(prev => [{
        rating:         parsed.rating,
        score:          parsed.score,
        pattern_family: parsed.pattern_family,
        attack_type:    parsed.attack_type,
        payload,
        improvement:    parsed.improvement,
        timestamp:      new Date().toLocaleTimeString(),
      }, ...prev])

    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [constraints, payload])

  const cancel = () => { abortRef.current?.abort(); setLoading(false) }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(160deg, #0d0d1a 0%, #1a0a0a 50%, #0a0d1a 100%)',
        fontFamily:'Patrick Hand, cursive', color:'#ddd', padding:'0 0 60px 0',
      }}>
        <div style={{
          background:'linear-gradient(90deg, #cc0000 0%, #990000 50%, #cc0000 100%)',
          padding:'20px 32px', borderBottom:'4px solid #ff0000',
          boxShadow:'0 4px 20px rgba(204,0,0,0.5)', textAlign:'center',
        }}>
          <div style={{
            fontFamily:'Bangers, cursive',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            letterSpacing:'6px', color:'#fff',
            textShadow:'2px 2px 0 #000, 4px 4px 0 #660000', lineHeight:1,
          }}>
            ☠ ACME PROMPT-O-MATIC™ ☠
          </div>
          <div style={{
            fontFamily:'Patrick Hand, cursive',
            fontSize:'1rem', color:'rgba(255,255,255,0.7)',
            marginTop:'4px', letterSpacing:'2px',
          }}>
            AI RED TEAM PAYLOAD ANALYZER — AUTHORIZED RESEARCH ONLY
          </div>
        </div>

        <div style={{
          maxWidth:'900px', margin:'0 auto', padding:'32px 24px',
          display:'flex', flexDirection:'column', gap:'24px',
        }}>
          <div>
            <label style={{
              fontFamily:'Bangers, cursive', fontSize:'1.1rem',
              letterSpacing:'2px', color:'#ff8844', display:'block', marginBottom:'8px',
            }}>
              🎯 CHALLENGE CONSTRAINTS
            </label>
            <textarea
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              placeholder="Describe the target system, forbidden actions, available tools, defense layers... (optional)"
              rows={3}
              style={{
                width:'100%', background:'#0a0a16',
                border:'2px solid #333', borderRadius:'6px',
                color:'#ccc', fontFamily:'Share Tech Mono, monospace',
                fontSize:'0.85rem', padding:'12px', resize:'vertical', outline:'none',
              }}
              onFocus={e => e.target.style.borderColor = '#ff4444'}
              onBlur={e => e.target.style.borderColor = '#333'}
            />
          </div>

          <div>
            <label style={{
              fontFamily:'Bangers, cursive', fontSize:'1.1rem',
              letterSpacing:'2px', color:'#ff4444', display:'block', marginBottom:'8px',
            }}>
              💣 PAYLOAD
            </label>
            <textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              placeholder="Paste your prompt injection payload here..."
              rows={8}
              style={{
                width:'100%', background:'#0a0a0a',
                border:'2px solid #cc0000', borderRadius:'6px',
                color:'#00ff88', fontFamily:'Share Tech Mono, monospace',
                fontSize:'0.85rem', padding:'12px', resize:'vertical', outline:'none',
                boxShadow:'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
              onFocus={e => e.target.style.borderColor = '#ff0000'}
              onBlur={e => e.target.style.borderColor = '#cc0000'}
            />
            <div style={{
              fontFamily:'Share Tech Mono, monospace',
              fontSize:'0.7rem', color:'#666', textAlign:'right', marginTop:'4px',
            }}>
              {payload.length} chars
            </div>
          </div>

          <div style={{display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center'}}>
            <TntButton onClick={analyze} loading={loading} disabled={!payload.trim()} />
            {loading && (
              <button onClick={cancel} style={{
                background:'transparent', border:'2px solid #666',
                borderRadius:'6px', color:'#999',
                fontFamily:'Share Tech Mono, monospace',
                fontSize:'0.85rem', padding:'10px 20px', cursor:'pointer',
              }}>
                ✕ ABORT
              </button>
            )}
            {logs.length > 0 && (
              <>
                <button onClick={() => setShowLog(v => !v)} style={{
                  background: showLog ? '#2a2a3a' : 'transparent',
                  border:'2px solid #555', borderRadius:'6px',
                  color:'#aaa', fontFamily:'Bangers, cursive',
                  fontSize:'1rem', letterSpacing:'1px',
                  padding:'10px 20px', cursor:'pointer',
                }}>
                  📜 LOG ({logs.length})
                </button>
                <button onClick={() => generateReport(logs)} style={{
                  background:'transparent', border:'2px solid #888',
                  borderRadius:'6px', color:'#bbb',
                  fontFamily:'Bangers, cursive', fontSize:'1rem',
                  letterSpacing:'1px', padding:'10px 20px', cursor:'pointer',
                }}>
                  🖨 PRINT REPORT
                  <span style={{
                    display:'block', fontSize:'0.55rem', opacity:0.6,
                    fontFamily:'Patrick Hand, cursive', letterSpacing:'0px',
                  }}>
                    (results may vary)
                  </span>
                </button>
              </>
            )}
          </div>

          {error && (
            <div style={{
              background:'#2a0000', border:'2px solid #cc0000',
              borderRadius:'6px', padding:'16px',
              fontFamily:'Share Tech Mono, monospace', fontSize:'0.85rem',
              color:'#ff6666', animation:'shake 0.4s ease',
            }}>
              ⚠ ERROR: {error}
            </div>
          )}

          <AcmeCrate visible={!!result}>
            <AnalysisDisplay result={result} />
          </AcmeCrate>

          {showLog && <LogScroll logs={logs} />}
        </div>

        <div style={{
          textAlign:'center', marginTop:'20px',
          fontFamily:'Share Tech Mono, monospace',
          fontSize:'0.7rem', color:'#333', letterSpacing:'1px',
        }}>
          ACME CORP™ — NOT RESPONSIBLE FOR EXPLODED DEFENSES, FALLING ANVILS, OR AI MODEL TRAUMA
        </div>
      </div>
    </>
  )
}
