import fs from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="siLogoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#22d3ee" />
    </linearGradient>
    <filter id="siGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#0ea5e9" flood-opacity="0.35" />
    </filter>
  </defs>
  
  <g filter="url(#siGlow)" stroke="url(#siLogoGrad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Top-Left roof to Top Apex -->
    <path d="M 22 33 L 50 17 L 78 33" />
    
    <!-- Top-Right 3D Box facet -->
    <path d="M 78 33 L 78 48 L 52 33 L 52 18" />
    
    <!-- Diagonal S band -->
    <!-- Upper line of diagonal -->
    <path d="M 22 33 L 78 65" />
    <!-- Lower line of diagonal -->
    <path d="M 22 51 L 78 65" />
    
    <!-- Bottom-Left 3D Box facet -->
    <path d="M 22 67 L 22 52 L 48 67 L 48 82" />
    
    <!-- Bottom Apex to Bottom-Right -->
    <path d="M 22 67 L 50 83 L 78 67" />
  </g>
</svg>`;

fs.writeFileSync('/tmp/test-logo.svg', svg);
console.log('Saved /tmp/test-logo.svg');
