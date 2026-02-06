
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE = 'public/icon.svg';
const OUT_DIR = 'public';

async function generateIcons() {
    if (!fs.existsSync(SOURCE)) {
        console.error('Source icon not found:', SOURCE);
        process.exit(1);
    }

    console.log('Generating icons from SVG...');

    await sharp(SOURCE)
        .resize(192, 192)
        .png()
        .toFile(path.join(OUT_DIR, 'pwa-192x192.png'));

    await sharp(SOURCE)
        .resize(512, 512)
        .png()
        .toFile(path.join(OUT_DIR, 'pwa-512x512.png'));

    // Favicon (32x32 for ico, or just use png)
    await sharp(SOURCE)
        .resize(64, 64)
        .png()
        .toFile(path.join(OUT_DIR, 'favicon.ico'));

    // Also update the source png for reference if needed, but we use SVG primary
    // Let's ensure we have a fallback png
    await sharp(SOURCE)
        .resize(512, 512)
        .png()
        .toFile(path.join(OUT_DIR, 'icon-512.png'));

    console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
