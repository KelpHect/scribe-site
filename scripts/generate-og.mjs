import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'og.png');

async function main() {
  const fontPath = join(__dirname, 'Inter-Bold.woff2');
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

  const screenshotPath = join(__dirname, '..', 'public', 'app-examples', 'installed.webp');
  const screenshotPng = await sharp(screenshotPath)
    .resize(560, 384, { fit: 'cover' })
    .png()
    .toBuffer();
  const screenshotB64 = `data:image/png;base64,${screenshotPng.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#09090b',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingLeft: 72,
                paddingRight: 32,
                gap: 20,
                flex: '0 0 52%',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: logoB64,
                    width: 80,
                    height: 80,
                    style: { borderRadius: 18 },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 48,
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
                            fontSize: 18,
                            color: '#71717a',
                            fontWeight: 500,
                            maxWidth: 440,
                            lineHeight: 1.4,
                          },
                          children: 'A fast ESO addon manager for people who are done babysitting Minion.',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 14,
                            color: '#3f3f46',
                            marginTop: 4,
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
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 64,
                paddingLeft: 16,
                flex: '0 0 48%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)',
                    },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: screenshotB64,
                          width: 480,
                          height: 329,
                        },
                      },
                    ],
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
