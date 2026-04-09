import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'og.png');

async function main() {
  const fontPath = join(__dirname, 'Inter-Bold.woff2');
  /** @type {ArrayBuffer} */
  let fontData;

  if (existsSync(fontPath)) {
    fontData = readFileSync(fontPath).buffer;
  } else {
    const res = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff');
    fontData = await res.arrayBuffer();
  }

  const logoPath = join(__dirname, '..', 'public', 'logo.png');
  const logoData = readFileSync(logoPath);
  const logoB64 = `data:image/png;base64,${logoData.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          fontFamily: 'Inter',
          gap: 24,
        },
        children: [
          {
            type: 'img',
            props: {
              src: logoB64,
              width: 180,
              height: 180,
              style: { borderRadius: 32 },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 56,
                      fontWeight: 800,
                      color: '#fafafa',
                      letterSpacing: '-0.04em',
                    },
                    children: 'Scribe',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 22,
                      color: '#71717a',
                      fontWeight: 500,
                      maxWidth: 600,
                      textAlign: 'center',
                    },
                    children: 'A fast ESO addon manager for people who are done babysitting Minion.',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 16,
                      color: '#3f3f46',
                      marginTop: 8,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    },
                    children: 'Windows \u00B7 Linux \u00B7 macOS',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(OUT, png);
  console.log('Generated ' + OUT + ' (' + png.length + ' bytes)');
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
