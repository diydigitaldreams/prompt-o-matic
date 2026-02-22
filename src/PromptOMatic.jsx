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
            fontFamily:'Bangers,
