/* =========================================================
   ICONS — 24px stroke set
   ========================================================= */
const ICONS = {
  home:'<path d="M3.5 11 12 4l8.5 7v8.5a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
  tasks:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.5 1.5L8 4.5M3.5 12l1.5 1.5L8 10.5M3.5 18l1.5 1.5L8 16.5"/>',
  timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5M19 6l1.5-1.5"/>',
  habits:'<rect x="3.5" y="4.5" width="17" height="16" rx="3.5"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4M9 15l2 2 4-4"/>',
  stats:'<path d="M5 20v-7M11 20V5M17 20v-10M3 20.5h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  play:'<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z" fill="currentColor"/>',
  pause:'<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3.5"/>',
  reset:'<path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5"/><path d="M4 3.5v5h5"/>',
  skip:'<path d="M5 5.5v13l10-6.5z" fill="currentColor"/><path d="M19 5.5v13"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  flame:'<path d="M13.5 2c.4 3.4 4.8 5.3 4.8 11a6.3 6.3 0 0 1-12.6.3c0-2.6 1.3-4.6 2.8-5.8 0 2.1.7 3.4 1.7 4C10.1 7.8 11.4 4.6 13.5 2z" fill="currentColor"/><path d="M12 20.3c-1.5 0-2.5-1.1-2.5-2.5 0-1.5 1.3-2.4 1.9-3.6.8 1.3 3.1 2.1 3.1 3.8 0 1.3-1 2.3-2.5 2.3z" fill="#fffaf5" stroke="none"/>',
  moon:'<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  chev:'<path d="m9 6 6 6-6 6"/>',
  swap:'<path d="M7 4 3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7"/>',
  leaf:'<path d="M5 19.5C5 10 11 5 20 4.5 20 13.5 15 19 5.5 19.5z"/><path d="M5 19.5l7-7"/>',
  drop:'<path d="M12 3s6.5 6.8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.8 12 3 12 3z"/>',
  book:'<path d="M3 5.5h5.5A3.5 3.5 0 0 1 12 9v11a2.5 2.5 0 0 0-2.5-2.5H3zM21 5.5h-5.5A3.5 3.5 0 0 0 12 9v11a2.5 2.5 0 0 1 2.5-2.5H21z"/>',
  pen:'<path d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5z"/><path d="m13.5 7 3.5 3.5"/>',
  dumbbell:'<path d="M6.5 7v10M17.5 7v10M3.5 10v4M20.5 10v4M6.5 12h11"/>',
  music:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.5"/><rect x="16.5" y="14" width="4" height="6" rx="1.5"/>',
  star:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20.5h7M10 17h4v3.5h-4z"/>',
  bolt:'<path d="M13 2.5 4.5 14H11l-1 7.5L19.5 10H13z"/>',
  coffee:'<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10.5h1.5a2.2 2.2 0 0 1 0 4.5H17M8 3v3M12 3v3"/>',
  trash:'<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l1 13h9l1-13M9 7V4h6v3"/>',
  sprout:'<path d="M12 21v-9M12 12c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5zM12 14c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  tomato:'<circle cx="12" cy="13.5" r="7.5"/><path d="M9 6.5 12 8l3-1.5M12 8V4"/>'
};
function icon(name,size=22,sw=2.3){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||''}</svg>`;
}
