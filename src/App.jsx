import { useEffect, useRef, useState } from 'react'
import { weapons } from './weapons.jsx'
import { playWeapon, preloadAll } from './soundEngine.js'
import './App.css'

function WaveformBars({ active }) {
  // 12 bars that "read" random levels while a shot/burst is playing
  const bars = new Array(12).fill(0)
  return (
    <div className={`waveform ${active ? 'is-live' : ''}`}>
      {bars.map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i % 6) * 0.045}s` }} />
      ))}
    </div>
  )
}

function WeaponCard({ weapon, volume, onFire, roundCount, disabled }) {
  const [firing, setFiring] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false })
  const cardRef = useRef(null)
  const timeoutRef = useRef(null)
  const useImage = weapon.image && !imageFailed

  const handleClick = () => {
    const duration = playWeapon(weapon, volume)
    onFire(weapon)
    setFiring(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setFiring(false), duration * 1000)
  }

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width   // 0 → 1
    const py = (e.clientY - rect.top) / rect.height    // 0 → 1

    const maxTilt = 14 // degrees
    const rotateX = (0.5 - py) * maxTilt * 2
    const rotateY = (px - 0.5) * maxTilt * 2

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: px * 100,
      glareY: py * 100,
      active: true,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false })
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <button
      ref={cardRef}
      className={`card ${firing ? 'is-firing' : ''} ${tilt.active ? 'is-tilting' : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-pressed={firing}
      disabled={disabled}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${tilt.active ? 'scale(1.035)' : 'scale(1)'}`,
      }}
    >
      <div
        className="card-glare"
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)`,
          opacity: tilt.active ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="card-top">
        <span className="card-tag">{weapon.tag}</span>
        <span className="card-count">{String(roundCount).padStart(3, '0')}</span>
      </div>

      <div className="card-icon-wrap">
        <div className="muzzle-flash" aria-hidden="true" />
        {useImage ? (
          <img
            src={weapon.image}
            alt={weapon.name}
            className="card-photo"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <svg viewBox="0 0 48 40" className="card-icon" aria-hidden="true">
            {icons[weapon.icon]}
          </svg>
        )}
      </div>

      <div className="card-bottom">
        <h3>{weapon.name}</h3>
        <p>{weapon.category}</p>
        <WaveformBars active={firing} />
      </div>

      <span className="card-hint">{firing ? 'FIRING' : 'CLICK TO FIRE'}</span>
    </button>
  )
}

export default function App() {
  const [volume, setVolume] = useState(0.8)
  const [totalRounds, setTotalRounds] = useState(0)
  const [roundCounts, setRoundCounts] = useState({})
  const [flash, setFlash] = useState(false)
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    preloadAll(weapons)
      .then(() => setReady(true))
      .catch(() => setLoadError(true))
  }, [])

  const handleFire = (weapon) => {
    const shots = weapon.shots || 1
    setTotalRounds((n) => n + shots)
    setRoundCounts((prev) => ({
      ...prev,
      [weapon.id]: (prev[weapon.id] || 0) + shots,
    }))
    setFlash(true)
    setTimeout(() => setFlash(false), 90)
  }

  return (
    <div className={`range ${flash ? 'range-flash' : ''}`}>
      <div className="range-scanlines" aria-hidden="true" />

      <header className="range-header">
        <div className="range-title">
          <span className="eyebrow">Hmmmm...</span>
          <h1 className="mainHeader">Gun Sounds</h1>
          <p className="range-sub">
            {loadError
              ? 'Some sound files failed to load — check that they exist in /public/sounds/.'
              : ready
              ? 'Guns loaded and ready. Click a card to go POSTAL!!!'
              : 'Loading sound files…'}
          </p>
        </div>

        <div className="range-hud">
          <div className="hud-stat">
            <span className="hud-label">ROUNDS FIRED</span>
            <span className="hud-value">{String(totalRounds).padStart(4, '0')}</span>
          </div>
          <div className="hud-volume">
            <span className="hud-label">MASTER VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Master volume"
            />
            <span className="hud-value">{Math.round(volume * 100)}%</span>
          </div>
        </div>
        <div class="quote">
          "I know what you're thinking, but the funny thing is, I don't even like video games!"<br/>- Postal dude
        </div>
      </header>

      <main className="card-grid">
        {weapons.map((weapon) => (
          <WeaponCard
            key={weapon.id}
            weapon={weapon}
            volume={volume}
            onFire={handleFire}
            roundCount={roundCounts[weapon.id] || 0}
            disabled={!ready}
          />
        ))}
      </main>
      <div class="bottom-quote">
        "I regret nothing!"<br/>- Postal dude
      </div>
      <footer className="range-footer">
        <span>Developed by Ario Bashiri using React+Vite, hosted on Github pages</span>
      </footer>
    </div>
  )
}
