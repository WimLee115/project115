import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Zet het icoon en het startscherm van de Android-app in elkaar.
 *
 * Capacitor levert zijn eigen blauwe standaardicoon mee; dat wordt hier
 * vervangen. Een script en geen handwerk, omdat `cap add android` de map
 * opnieuw aanmaakt zodra hij ooit weggegooid wordt — dan moet dit met één
 * commando terug te zetten zijn in plaats van met vijftien keer exporteren.
 *
 * Er is bewust geen generatorpakket voor gebruikt. `@capacitor/assets` doet
 * hetzelfde maar sleept achttien kwetsbare afhankelijkheden mee voor werk dat
 * ImageMagick in twintig regels doet.
 *
 * Vereist: ImageMagick 7 (`magick`).
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const assets = join(root, 'assets');
const res = join(root, 'android/app/src/main/res');

/** Het accentpaars uit `globals.css`, en de donkere achtergrond ernaast. */
const ACCENT = '#6D3FD4';
const SURFACE_DARK = '#101319';
const SURFACE_LIGHT = '#F4F5F7';

/**
 * Schermdichtheden van Android. De getallen zijn pixels bij een icoon van
 * 48dp (klassiek) respectievelijk 108dp (adaptief).
 */
const DENSITIES = [
  { name: 'mdpi', legacy: 48, adaptive: 108 },
  { name: 'hdpi', legacy: 72, adaptive: 162 },
  { name: 'xhdpi', legacy: 96, adaptive: 216 },
  { name: 'xxhdpi', legacy: 144, adaptive: 324 },
  { name: 'xxxhdpi', legacy: 192, adaptive: 432 },
];

function magick(args: string[]): void {
  execFileSync('magick', args, { stdio: 'inherit' });
}

if (!existsSync(res)) {
  throw new Error(
    'De map android/ bestaat niet. Draai eerst `npx cap add android`.',
  );
}

/* --- 1. Startpictogram ---------------------------------------------------- */

for (const density of DENSITIES) {
  const dir = join(res, `mipmap-${density.name}`);
  mkdirSync(dir, { recursive: true });

  // Klassiek icoon: afgeronde vierkant, voor Android 7 en ouder.
  magick([
    join(assets, 'icon-only.png'),
    '-resize',
    `${density.legacy}x${density.legacy}`,
    `PNG32:${join(dir, 'ic_launcher.png')}`,
  ]);

  // Ronde variant, voor launchers die daarom vragen.
  const circle = join(dir, 'ic_launcher_round.png');
  magick([
    join(assets, 'icon-background.png'),
    join(assets, 'icon-foreground.png'),
    '-composite',
    '-resize',
    `${density.legacy}x${density.legacy}`,
    '(',
    '-size',
    `${density.legacy}x${density.legacy}`,
    'xc:none',
    '-fill',
    'white',
    '-draw',
    `circle ${density.legacy / 2},${density.legacy / 2} ${density.legacy / 2},0`,
    ')',
    '-alpha',
    'off',
    '-compose',
    'CopyOpacity',
    '-composite',
    `PNG32:${circle}`,
  ]);

  // Adaptieve voorgrond: het hele vlak van 108dp, met de '115' binnen de
  // middelste 72dp. Wat daarbuiten valt snijdt de launcher weg, en hoevéél
  // verschilt per toestel.
  magick([
    join(assets, 'icon-foreground.png'),
    '-resize',
    `${density.adaptive}x${density.adaptive}`,
    `PNG32:${join(dir, 'ic_launcher_foreground.png')}`,
  ]);
}

/* --- 2. Kleuren ----------------------------------------------------------- */

writeFileSync(
  join(res, 'values/ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${ACCENT}</color>
</resources>
`,
  'utf8',
);

writeFileSync(
  join(res, 'values/colors.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Gegenereerd door scripts/android-assets.ts; ontleend aan globals.css. -->
<resources>
    <color name="colorPrimary">${ACCENT}</color>
    <color name="colorPrimaryDark">#5A2FB8</color>
    <color name="colorAccent">${ACCENT}</color>
    <color name="splash_background">${SURFACE_LIGHT}</color>
</resources>
`,
  'utf8',
);

mkdirSync(join(res, 'values-night'), { recursive: true });
writeFileSync(
  join(res, 'values-night/colors.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">${SURFACE_DARK}</color>
</resources>
`,
  'utf8',
);

/* --- 3. Startscherm ------------------------------------------------------- */

// De bitmaps van Capacitor eruit: een PNG als vensterachtergrond wordt
// uitgerekt tot schermvullend, en dan staat de '115' vervormd in beeld.
for (const orientation of ['port', 'land']) {
  for (const density of DENSITIES) {
    rmSync(join(res, `drawable-${orientation}-${density.name}`), {
      recursive: true,
      force: true,
    });
  }
}
rmSync(join(res, 'drawable/splash.png'), { force: true });
rmSync(join(res, 'drawable/ic_launcher_background.xml'), { force: true });

// Het beeldmerk voor het startscherm is het volledige icoon, dus mét zijn
// paarse vlak. De losse voorgrond is wit en zou op de lichte achtergrond
// onzichtbaar zijn.
const LOGO_DP = 144;
for (const density of DENSITIES) {
  const dir = join(res, `drawable-${density.name}`);
  mkdirSync(dir, { recursive: true });

  const size = Math.round((LOGO_DP * density.legacy) / 48);
  magick([
    join(assets, 'icon-only.png'),
    '-resize',
    `${size}x${size}`,
    `PNG32:${join(dir, 'splash_logo.png')}`,
  ]);
}

const splash = `<?xml version="1.0" encoding="utf-8"?>
<!--
    Gegenereerd door scripts/android-assets.ts.

    Een gelaagde tekening in plaats van een bitmap: de achtergrond vult het
    scherm en het beeldmerk staat op ware grootte in het midden. Eén enkele PNG
    als vensterachtergrond wordt uitgerekt tot schermvullend, en dan staat het
    beeldmerk op elk toestel anders vervormd in beeld.
-->
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo" />
    </item>
</layer-list>
`;

writeFileSync(join(res, 'drawable/splash.xml'), splash, 'utf8');

console.log('[android] icoon en startscherm bijgewerkt in', res);
