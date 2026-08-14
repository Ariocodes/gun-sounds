// Loads real audio files and plays them back via the Web Audio API.
// Files are decoded into AudioBuffers once, then played from memory —
// this keeps playback instant and lets rapid clicks overlap cleanly
// instead of cutting a previous shot off (which a plain <audio> tag
// tends to do).

let ctx = null
const bufferCache = new Map() // url -> AudioBuffer
const loadingCache = new Map() // url -> Promise<AudioBuffer>

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Fetches + decodes a sound file once, caches the result, and reuses
// it for every future play. Safe to call multiple times for the same url.
export function preload(url) {
  if (bufferCache.has(url)) return Promise.resolve(bufferCache.get(url))
  if (loadingCache.has(url)) return loadingCache.get(url)

  const audioCtx = getContext()
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
      return res.arrayBuffer()
    })
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      bufferCache.set(url, audioBuffer)
      loadingCache.delete(url)
      return audioBuffer
    })
    .catch((err) => {
      loadingCache.delete(url)
      console.error(err)
      throw err
    })

  loadingCache.set(url, promise)
  return promise
}

// Preload every weapon's file up front (call this once on app start)
// so the very first click has zero fetch/decode delay.
export function preloadAll(weapons) {
  return Promise.all(weapons.map((w) => preload(w.file)))
}

function playBuffer(audioBuffer, master, t0) {
  const source = getContext().createBufferSource()
  source.buffer = audioBuffer
  source.connect(master)
  source.start(t0)
  return source
}

// Fires a weapon: plays its file once, or several times back-to-back
// (with slight timing jitter) to simulate burst/automatic fire.
export function playWeapon(weapon, masterVolume = 1) {
  const audioCtx = getContext()
  const master = audioCtx.createGain()
  master.gain.value = Math.max(0, Math.min(1, masterVolume))
  master.connect(audioCtx.destination)

  const shots = weapon.shots || 1
  const interval = weapon.interval || 0

  const audioBuffer = bufferCache.get(weapon.file)
  if (!audioBuffer) {
    // Not loaded yet (e.g. preload hasn't resolved) — load then play once.
    preload(weapon.file).then((buf) => playBuffer(buf, master, audioCtx.currentTime))
    return 0.3
  }

  for (let i = 0; i < shots; i++) {
    const jitter = shots > 1 ? (Math.random() - 0.5) * interval * 0.15 : 0
    playBuffer(audioBuffer, master, audioCtx.currentTime + i * interval + jitter)
  }

  const totalDuration = (shots - 1) * interval + audioBuffer.duration + 0.1
  return totalDuration
}
