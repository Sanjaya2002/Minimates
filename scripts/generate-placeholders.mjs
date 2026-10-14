// Generates on-brand pastel SVG placeholder artwork for products, categories
// and hero sections. Run with: node scripts/generate-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const palette = {
  sky: "#9EC8EB",
  skyDark: "#7FB3DF",
  pink: "#DA74A3",
  sunshine: "#F4D77B",
  lavender: "#D99ADB",
  lime: "#C7CE66",
  blush: "#E8ACC7",
  cream: "#F5F0DC",
  lilac: "#EEC3F4",
  pistachio: "#DAE096",
};

const gradients = [
  [palette.sky, palette.lilac],
  [palette.blush, palette.sky],
  [palette.sunshine, palette.pistachio],
  [palette.lavender, palette.blush],
  [palette.lime, palette.sky],
  [palette.pink, palette.lilac],
  [palette.sky, palette.cream],
  [palette.pistachio, palette.sunshine],
];

function icon(name, cx, cy, scale, color) {
  const s = scale;
  const t = `translate(${cx} ${cy}) scale(${s})`;
  const common = `fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"`;
  const solid = `fill="${color}"`;
  switch (name) {
    case "bottle":
      return `<g transform="${t}">
        <rect x="-40" y="-20" width="80" height="150" rx="34" ${common}/>
        <rect x="-22" y="-70" width="44" height="40" rx="12" ${common}/>
        <line x1="-22" y1="-88" x2="22" y2="-88" ${common}/>
        <line x1="-18" y1="40" x2="18" y2="40" ${solid}/>
      </g>`;
    case "teddy":
      return `<g transform="${t}">
        <circle cx="-46" cy="-52" r="22" ${solid}/>
        <circle cx="46" cy="-52" r="22" ${solid}/>
        <circle cx="0" cy="-10" r="62" ${common}/>
        <circle cx="-22" cy="-18" r="6" ${solid}/>
        <circle cx="22" cy="-18" r="6" ${solid}/>
        <ellipse cx="0" cy="18" rx="30" ry="26" ${common}/>
        <circle cx="0" cy="18" r="8" ${solid}/>
      </g>`;
    case "heart":
      return `<path transform="${t}" d="M0 60 C-70 10 -70 -40 -30 -40 C-8 -40 0 -22 0 -12 C0 -22 8 -40 30 -40 C70 -40 70 10 0 60 Z" ${solid}/>`;
    case "star":
      return `<path transform="${t}" d="M0 -60 L18 -18 L62 -18 L26 10 L40 54 L0 28 L-40 54 L-26 10 L-62 -18 L-18 -18 Z" ${solid}/>`;
    case "cloud":
      return `<g transform="${t}"><path d="M-70 30 a34 34 0 0 1 6 -66 a44 44 0 0 1 84 -6 a30 30 0 0 1 44 28 a26 26 0 0 1 -8 44 Z" ${solid}/></g>`;
    case "flower":
      return `<g transform="${t}">
        <circle cx="0" cy="-34" r="26" ${solid}/><circle cx="32" cy="-12" r="26" ${solid}/>
        <circle cx="20" cy="28" r="26" ${solid}/><circle cx="-20" cy="28" r="26" ${solid}/>
        <circle cx="-32" cy="-12" r="26" ${solid}/><circle cx="0" cy="0" r="18" fill="${palette.sunshine}"/>
      </g>`;
    case "duck":
      return `<g transform="${t}">
        <circle cx="20" cy="-30" r="30" ${solid}/>
        <path d="M50 -30 l26 8 l-26 10 z" fill="${palette.sunshine}"/>
        <path d="M-52 20 a52 34 0 0 0 104 0 z" ${solid}/>
        <circle cx="30" cy="-38" r="5" fill="#2b2b3a"/>
      </g>`;
    case "ball":
      return `<g transform="${t}"><circle r="62" ${common}/><path d="M-52 -30 q52 -46 104 0" ${common}/><path d="M-52 30 q52 46 104 0" ${common}/><circle r="16" ${solid}/></g>`;
    case "onesie":
      return `<g transform="${t}">
        <path d="M-46 -56 q46 -18 92 0 l18 22 -26 18 -6 -8 v86 a10 10 0 0 1 -10 10 h-58 a10 10 0 0 1 -10 -10 v-86 l-6 8 -26 -18 z" ${common}/>
      </g>`;
    case "pacifier":
      return `<g transform="${t}">
        <circle cx="0" cy="0" r="46" ${common}/>
        <circle cx="0" cy="0" r="24" ${solid}/>
        <path d="M-30 40 q30 40 60 0" ${common}/>
      </g>`;
    case "block":
      return `<g transform="${t}">
        <rect x="-52" y="-12" width="104" height="64" rx="12" ${common}/>
        <text x="0" y="34" font-family="Poppins, sans-serif" font-size="54" font-weight="700" text-anchor="middle" fill="${color}">A</text>
      </g>`;
    case "leaf":
      return `<g transform="${t}"><path d="M0 60 C-70 20 -60 -60 0 -60 C60 -60 70 20 0 60 Z" ${common}/><line x1="0" y1="60" x2="0" y2="-40" ${common}/></g>`;
    default:
      return `<circle r="60" ${solid} transform="${t}"/>`;
  }
}

function doodle(name, cx, cy, scale, color, opacity) {
  return `<g opacity="${opacity}">${icon(name, cx, cy, scale, color)}</g>`;
}

function svg({ w, h, index, iconName, title }) {
  const [c1, c2] = gradients[index % gradients.length];
  const id = `g${index}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${w * 0.16}" fill="#ffffff" opacity="0.22"/>
  <circle cx="${w * 0.16}" cy="${h * 0.82}" r="${w * 0.2}" fill="#ffffff" opacity="0.16"/>
  ${doodle("cloud", w * 0.2, h * 0.24, w / 900, "#ffffff", 0.5)}
  ${doodle("star", w * 0.8, h * 0.74, w / 1400, "#ffffff", 0.55)}
  <g transform="translate(${w / 2} ${h / 2})">
    <circle r="${w * 0.28}" fill="#ffffff" opacity="0.9"/>
    ${icon(iconName, 0, 0, w / 850, palette.skyDark)}
  </g>
</svg>`;
}

const products = [
  ["baby-shampoo", "bottle"],
  ["teddy-bear", "teddy"],
  ["gentle-lotion", "bottle"],
  ["star-pacifier", "pacifier"],
  ["organic-wipes", "leaf"],
  ["duck-bath-toy", "duck"],
  ["onesie-set", "onesie"],
  ["soft-blocks", "block"],
  ["plush-heart", "heart"],
  ["play-ball", "ball"],
  ["flower-bib", "flower"],
  ["night-cloud", "cloud"],
  ["sunshine-cream", "bottle"],
  ["baby-blanket", "cloud"],
  ["kids-tee", "onesie"],
  ["stacking-rings", "ball"],
];

const categories = [
  ["bath-care", "duck"],
  ["feeding", "bottle"],
  ["diapers-wipes", "leaf"],
  ["clothing", "onesie"],
  ["toys-play", "teddy"],
  ["health-safety", "heart"],
];

function ensure(rel) {
  const full = resolve(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  return full;
}

products.forEach(([slug, iconName], i) => {
  const file = ensure(`public/images/products/${slug}.svg`);
  writeFileSync(file, svg({ w: 800, h: 800, index: i, iconName, title: slug }));
});

categories.forEach(([slug, iconName], i) => {
  const file = ensure(`public/images/categories/${slug}.svg`);
  writeFileSync(file, svg({ w: 1200, h: 900, index: i + 2, iconName, title: slug }));
});

const hero = ensure("public/images/hero.svg");
writeFileSync(
  hero,
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-label="Happy baby care">
  <defs>
    <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.sunshine}"/>
      <stop offset="1" stop-color="${palette.blush}"/>
    </linearGradient>
  </defs>
  <circle cx="450" cy="450" r="360" fill="url(#heroBg)"/>
  <circle cx="720" cy="180" r="70" fill="#ffffff" opacity="0.35"/>
  <circle cx="150" cy="700" r="90" fill="#ffffff" opacity="0.28"/>
  ${doodle("cloud", 740, 620, 0.9, "#ffffff", 0.7)}
  ${doodle("heart", 180, 220, 0.7, "#ffffff", 0.7)}
  ${doodle("star", 700, 760, 0.6, "#ffffff", 0.7)}
  <g transform="translate(450 470)">
    <circle r="190" fill="#ffffff" opacity="0.92"/>
    ${icon("teddy", 0, -10, 1.6, palette.pink)}
  </g>
</svg>`,
);

const og = ensure("public/images/og-default.svg");
writeFileSync(
  og,
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Minimates">
  <rect width="1200" height="630" fill="${palette.sky}"/>
  <circle cx="1050" cy="120" r="160" fill="#ffffff" opacity="0.2"/>
  <circle cx="160" cy="540" r="200" fill="#ffffff" opacity="0.15"/>
  ${doodle("cloud", 220, 140, 1.1, "#ffffff", 0.6)}
  ${doodle("star", 1000, 500, 0.9, "#ffffff", 0.6)}
  <text x="120" y="330" font-family="Poppins, sans-serif" font-size="120" font-weight="800" fill="#ffffff">Minimates</text>
  <text x="126" y="410" font-family="Nunito, sans-serif" font-size="46" font-weight="600" fill="#2b2b3a">Baby &amp; Kids Care</text>
</svg>`,
);

console.log(`Generated ${products.length} product, ${categories.length} category, hero and og images.`);
