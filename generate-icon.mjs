import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <!-- Background circle -->
  <circle cx="90" cy="90" r="90" fill="#fff5f5"/>

  <!-- Leaves -->
  <ellipse cx="72" cy="58" rx="14" ry="22" fill="#22c55e" transform="rotate(-30 72 58)"/>
  <ellipse cx="90" cy="50" rx="14" ry="24" fill="#16a34a"/>
  <ellipse cx="108" cy="58" rx="14" ry="22" fill="#22c55e" transform="rotate(30 108 58)"/>

  <!-- Strawberry body -->
  <path d="M55 72 Q48 95 62 115 Q74 132 90 136 Q106 132 118 115 Q132 95 125 72 Q112 62 90 60 Q68 62 55 72Z"
        fill="#ef4444"/>

  <!-- Highlight -->
  <ellipse cx="76" cy="85" rx="9" ry="14" fill="#f87171" opacity="0.5" transform="rotate(-15 76 85)"/>

  <!-- Seeds -->
  <ellipse cx="80" cy="82" rx="3" ry="4" fill="#fef2f2" transform="rotate(-10 80 82)"/>
  <ellipse cx="100" cy="82" rx="3" ry="4" fill="#fef2f2" transform="rotate(10 100 82)"/>
  <ellipse cx="72" cy="100" rx="3" ry="4" fill="#fef2f2" transform="rotate(-5 72 100)"/>
  <ellipse cx="90" cy="97" rx="3" ry="4" fill="#fef2f2"/>
  <ellipse cx="108" cy="100" rx="3" ry="4" fill="#fef2f2" transform="rotate(5 108 100)"/>
  <ellipse cx="80" cy="116" rx="3" ry="4" fill="#fef2f2" transform="rotate(-5 80 116)"/>
  <ellipse cx="100" cy="116" rx="3" ry="4" fill="#fef2f2" transform="rotate(5 100 116)"/>
</svg>
`;

await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile('public/icons/apple-touch-icon.png');

console.log('Icon generated: public/icons/apple-touch-icon.png');
