// Simplified, stylised silhouettes (not technical drawings) used as card icons.
export const icons = {
  pistol: (
    <path d="M6 30h30v6H20v6H6v-2H2v-6h4v-4z M20 24h10v6H20z" />
  ),
  revolver: (
    <path d="M6 28c8-2 16-2 24 2l6-2v6l-6 2H24v6H10v-2H6v-6h4v-3c-2 0-4-1-4-3z M22 21a4 4 0 108 0 4 4 0 00-8 0z" />
  ),
  shotgun: (
    <path d="M2 30h4v-2h36v4H26v6H12v-2H8v-6H2z M42 27h4v6h-4z" />
  ),
  rifle: (
    <path d="M2 32h30v-3h4v-3h8v6h-4v3H24v5H10v-2H6v-6H2z M32 26v3h4v-3z" />
  ),
  sniper: (
    <path d="M2 33h6v-4h30v-2h6v6h-4v3H18v5H8v-2H4v-6H2z M14 25v4M22 25v4M30 25v4" />
  ),
  smg: (
    <path d="M4 28h26v-2h12v6h-6v3H18v5H8v-2H4v-6h2v-2H4z M16 32v6" />
  ),
}

// `file` points at a real audio file in /public/sounds/ — drop your own
// .mp3 (recommended) or .ogg/.wav files in there with these exact names,
// or change the paths below to match whatever you name them.
//
// `image` (optional) points at a real picture in /public/images/ — drop
// a .png/.jpg/.svg in there and set the path here to use it instead of
// the drawn placeholder icon. Leave it out (or set to null) to keep the
// drawn icon for that card.
//
// `shots`/`interval` (seconds) make auto weapons replay the same file
// several times back-to-back to simulate burst/full-auto fire.
export const weapons = [
  {
    id: 'pistol',
    name: 'pistol',
    category: '9mm Semi-Auto',
    tag: 'M1',
    icon: 'pistol',
    image: '/images/pistol.png',
    file: '/sounds/pistol.wav',
  },
  {
    id: 'revolver',
    name: 'revolver',
    category: '.357 Revolver',
    tag: 'M2',
    icon: 'revolver',
    image: '/images/revolver.png',
    file: '/sounds/revolver.wav',
  },
  {
    id: 'shotgun',
    name: 'shotgun',
    category: '12 Gauge Pump',
    tag: 'M3',
    icon: 'shotgun',
    image: '/images/shotgun.png',
    file: '/sounds/shotgun.wav',
  },
  {
    id: 'rifle',
    name: 'Assault Rifle',
    category: '5.56 Select-Fire',
    tag: 'M4',
    icon: 'rifle',
    image: '/images/rifle.png',
    shots: 3,
    interval: 0.09,
    file: '/sounds/rifle.wav',
  },
  {
    id: 'sniper',
    name: 'sniper',
    category: '.308 Bolt-Action',
    tag: 'M5',
    icon: 'sniper',
    image: '/images/sniper.png',
    file: '/sounds/sniper.wav',
  },
  {
    id: 'smg',
    name: 'smg',
    category: '9mm Full-Auto',
    tag: 'M6',
    icon: 'smg',
    image: '/images/smg.png',
    shots: 6,
    interval: 0.065,
    file: '/sounds/smg.wav',
  },
]
