/* =========================================================
   MASCOT — "Toma", an original tomato buddy (moods: happy, focus, chill, cool)
   ========================================================= */
function mascot(mood='happy'){
  const ink='#2b2522';
  const eyes={
    happy:`<path d="M42 70q5-7 10 0M68 70q5-7 10 0" fill="none"/>`,
    focus:`<circle cx="47" cy="70" r="4.5" fill="${ink}"/><circle cx="73" cy="70" r="4.5" fill="${ink}"/><path d="M39 60l12 4M81 60l-12 4" fill="none"/>`,
    chill:`<path d="M41 70q6 4 11 0M68 70q6 4 11 0" fill="none"/>`,
    cool:`<rect x="35" y="61" width="22" height="14" rx="5" fill="#84a59d"/><rect x="63" y="61" width="22" height="14" rx="5" fill="#84a59d"/><path d="M57 66h6M38 64l8 0" fill="none"/><path d="M40 64.5l5 5M66 64.5l5 5" stroke="#fffaf5" stroke-width="2.5"/>`
  }[mood];
  const mouth={
    happy:`<path d="M50 82q10 12 20 0z" fill="${ink}"/>`,
    focus:`<path d="M54 86q6-3 12 0" fill="none"/>`,
    chill:`<path d="M52 84q8 6 16 0" fill="none"/>`,
    cool:`<path d="M50 83q12 10 22-2" fill="none"/>`
  }[mood];
  return `<svg viewBox="0 0 120 124" aria-hidden="true"><g stroke="${ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M60 30c29 0 47 17 46 44-1 27-21 42-47 42S13 101 14 74c1-27 17-44 46-44z" fill="#f28482"/>
    <path d="M30 56c3-9 10-14 18-15" fill="none" stroke="#fffaf5" stroke-width="5" opacity=".8"/>
    <path d="M60 33 47 24l12-1 1-13 7 12 12-3-8 10 9 8-14-3z" fill="#84a59d"/>
    <path d="M60 10V3" fill="none"/>
    ${eyes}${mouth}
    </g><ellipse cx="36" cy="84" rx="7" ry="4.5" fill="#f5cac3"/><ellipse cx="84" cy="84" rx="7" ry="4.5" fill="#f5cac3"/></svg>`;
}
