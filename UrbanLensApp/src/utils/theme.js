// src/utils/theme.js
// Rich dark theme — deep navy base, vivid electric accents
// Inspired by: what's running on device + Citizen/Linear/Vercel dark palette

export const theme = {
  colors: {
    // ── Backgrounds ──
    bg:          '#0A0F1E',   // deepest navy-black (page bg)
    surface:     '#111827',   // slightly lifted (card bg)
    surfaceHigh: '#1A2235',   // even more lifted (nested cards)
    surfaceBorder:'#1E2D45',  // subtle borders on dark surface

    // ── Nav / Header ──
    nav:         '#080D1A',   // darkest — app bar, tab bar
    navBorder:   'rgba(255,255,255,0.07)',

    // ── Primary accent — electric indigo/blue ──
    accent:      '#4F6EF7',   // vivid indigo-blue
    accentDark:  '#3B56D4',
    accentSoft:  'rgba(79,110,247,0.18)',
    accentGlow:  'rgba(79,110,247,0.40)',

    // ── Semantic ──
    green:       '#22C55E',
    greenDark:   '#16A34A',
    greenSoft:   'rgba(34,197,94,0.15)',
    red:         '#EF4444',
    redDark:     '#DC2626',
    redSoft:     'rgba(239,68,68,0.15)',
    orange:      '#F59E0B',
    orangeDark:  '#D97706',
    orangeSoft:  'rgba(245,158,11,0.15)',
    teal:        '#06B6D4',
    tealSoft:    'rgba(6,182,212,0.15)',
    purple:      '#A855F7',
    purpleSoft:  'rgba(168,85,247,0.15)',

    // ── Live ──
    live:        '#22C55E',
    liveSoft:    'rgba(34,197,94,0.18)',

    // ── Text ──
    textPrimary:   '#F1F5FF',
    textSecondary: 'rgba(200,215,255,0.65)',
    textTertiary:  'rgba(160,185,240,0.40)',
    textInverse:   '#0A0F1E',

    // ── Borders & dividers ──
    border:      'rgba(255,255,255,0.08)',
    borderStrong:'rgba(255,255,255,0.14)',
  },

  radius: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24, full: 999 },

  shadow: {
    card:   { shadowColor: '#000', shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.4, shadowRadius: 12, elevation: 5 },
    accent: { shadowColor: '#4F6EF7', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 7 },
    green:  { shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
    red:    { shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  },
};