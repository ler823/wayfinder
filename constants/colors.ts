// Wayfinder Design System — Color Tokens
//
// Navy    (#1B3F5C) — trust, stability, direction; used for navigation, active states, progress
// Action  (#C8782A) — warm amber; warmth, optimism, "the lit path"; reserved for primary CTAs only
// Urgent  (#B84F2D) — terra cotta; "pay attention" without triggering alarm the way pure red does
// Success (#3D7A5B) — sage green; growth, completion, calm achievement
// Background (#F8F6F2) — warm off-white; welcoming paper, not a clinical form

export const colors = {
  navy:    '#1B3F5C',
  action:  '#C8782A',
  urgent:  '#B84F2D',
  success: '#3D7A5B',

  background:    '#F8F6F2',
  surface:       '#FFFFFF',
  surfaceSubtle: '#F2EEE9',

  text: {
    primary:   '#1C1917',
    secondary: '#6B6560',
    tertiary:  '#9C9590',
    inverse:   '#FFFFFF',
  },

  border:   '#E2DDD9',
  disabled: '#C4BDB7',

  // Deadline category badge palettes — financial aid = gold, academic = navy, etc.
  category: {
    'financial-aid': { bg: '#FDF3E3', text: '#7A4B10' },
    academic:        { bg: '#E8EEF4', text: '#1B3F5C' },
    registration:    { bg: '#E8F2EC', text: '#2B5C40' },
    advising:        { bg: '#E8F0F4', text: '#1B4050' },
  },
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
} as const;

export const typeScale = {
  xs:    11,
  sm:    13,
  base:  15,
  md:    17,
  lg:    20,
  xl:    22,
  '2xl': 32,
} as const;
