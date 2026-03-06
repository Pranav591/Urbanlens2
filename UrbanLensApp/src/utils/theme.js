export const theme = {
  colors: {
    // Background gradient stops (used with LinearGradient or layered Views)
    gradA:         '#060B1A',   // deepest navy-black
    gradB:         '#0D1B3E',   // deep navy
    gradC:         '#0F2460',   // mid navy-indigo
    gradD:         '#1A1040',   // indigo-purple

    // Glass surface colors (semi-transparent)
    glassWhite:    'rgba(255,255,255,0.10)',   // primary glass card
    glassWhiteMid: 'rgba(255,255,255,0.14)',   // hovered/focused glass
    glassWhiteHi:  'rgba(255,255,255,0.20)',   // strong glass (hero stats)
    glassDark:     'rgba(0,0,0,0.25)',          // dark glass overlay

    // Glass borders (the "edge light" effect)
    glassBorder:   'rgba(255,255,255,0.18)',
    glassBorderHi: 'rgba(255,255,255,0.35)',
    glassInner:    'rgba(255,255,255,0.06)',    // inner highlight

    // Accent - electric blue (primary CTA)
    blue:          '#3B82F6',
    blueBright:    '#60A5FA',
    blueGlow:      'rgba(59,130,246,0.45)',
    blueSoft:      'rgba(59,130,246,0.15)',

    // Accent - violet (secondary)
    violet:        '#7C3AED',
    violetBright:  '#A78BFA',
    violetGlow:    'rgba(124,58,237,0.40)',
    violetSoft:    'rgba(124,58,237,0.15)',

    // Accent - teal (tertiary / live)
    teal:          '#06B6D4',
    tealGlow:      'rgba(6,182,212,0.40)',
    tealSoft:      'rgba(6,182,212,0.15)',

    // Live indicator
    live:          '#22C55E',
    liveSoft:      'rgba(34,197,94,0.20)',

    // Semantic
    green:         '#10B981',
    greenSoft:     'rgba(16,185,129,0.18)',
    greenBright:   '#34D399',
    red:           '#EF4444',
    redSoft:       'rgba(239,68,68,0.18)',
    redBright:     '#F87171',
    orange:        '#F59E0B',
    orangeSoft:    'rgba(245,158,11,0.18)',
    orangeBright:  '#FCD34D',

    // Text on dark glass
    textPrimary:   '#F0F4FF',
    textSecondary: 'rgba(224,232,255,0.70)',
    textTertiary:  'rgba(196,210,255,0.45)',
    textInverse:   '#060B1A',

    // Aliases
    accent:     '#3B82F6',
    accentSoft: 'rgba(59,130,246,0.15)',
  },

  radius: { xs: 6, sm: 12, md: 18, lg: 24, xl: 32, full: 999 },

  // Glow shadows for glass elements
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 10,
    },
    blue: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.55,
      shadowRadius: 14,
      elevation: 8,
    },
    violet: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.50,
      shadowRadius: 14,
      elevation: 8,
    },
    teal: {
      shadowColor: '#06B6D4',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.50,
      shadowRadius: 12,
      elevation: 7,
    },
  },
};