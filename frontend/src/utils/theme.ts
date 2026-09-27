/**
 * TRANSITX — AMBER / URBAN MOBILITY THEME PALETTE
 * Official Brand Design System Specifications
 */

export const THEME = {
  // Brand Amber System
  primaryAmber: '#D89B32',
  brightAmber: '#E7AE45',
  softAmber: '#F2C66D',
  paleAmber: '#FFF3D6',
  deepAmber: '#A86F18',

  // Surfaces & Backgrounds
  mainBackground: '#F7F5EF',
  card: '#FFFFFF',
  secondaryBackground: '#EEEAE0',
  panel: '#FFFFFF',

  // Typography
  text: '#242521',
  secondaryText: '#6E6E67',
  border: '#DDD9CF',

  // Dark Sidebar
  darkSidebar: '#242621',
  darkSidebarSecondary: '#2D302A',
  sidebarText: '#D8D8D0',
  sidebarMuted: '#92958B',

  // Secondary Accents & Data
  olive: '#7B8068',
  terracotta: '#C56F4B',
  mutedPlum: '#756274',
  charcoal: '#242521',

  // Semantic Only (Operational Status & Traffic)
  semantic: {
    operational: '#5F8A63', // Green allowed ONLY for operational/normal/healthy
    normal: '#5F8A63',
    moderate: '#D89B32',
    high: '#C96B3C',
    severe: '#A83F35',
  },

  // Traffic Congestion Status
  traffic: {
    normal: '#5F8A63',
    slow: '#D89B32',
    heavy: '#C56F4B',
    severe: '#8B1E1E',
  },

  // Chart Data Palette
  chartColors: [
    '#D89B32', // Primary Amber
    '#242521', // Deep Charcoal
    '#7B8068', // Olive
    '#C56F4B', // Terracotta
    '#756274', // Muted Plum
  ],

  // Route Colors
  routeColors: [
    '#D89B32', // Amber
    '#C56F4B', // Terracotta
    '#7B8068', // Olive
    '#756274', // Muted Plum
    '#242521', // Deep Charcoal
  ]
} as const;

export function getStatusStyle(status?: string) {
  switch (status?.toLowerCase()) {
    case 'delay':
    case 'critical':
    case 'severe':
      return { bg: '#FDF2F0', text: '#A83F35', border: '#F2CCC7', dot: '#A83F35' };
    case 'busy':
    case 'high demand':
    case 'high':
      return { bg: '#FDF5EC', text: '#C96B3C', border: '#F7DDCB', dot: '#C96B3C' };
    case 'moderate':
      return { bg: '#FFF8EB', text: '#A86F18', border: '#FDE4B4', dot: '#D89B32' };
    case 'normal':
    case 'operational':
    default:
      return { bg: '#F2F7F3', text: '#3E6642', border: '#CCE0CE', dot: '#5F8A63' };
  }
}
