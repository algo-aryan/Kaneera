const sharp = require('sharp');

async function createWideBanners() {
  const configs = [
    { in: 'public/first_access_banner_new.png', out: 'public/wide_first_access_banner.png', hex: '#000000' }
  ];

  for (const c of configs) {
    try {
      await sharp({
        create: {
          width: 3000,
          height: 1024,
          channels: 4,
          background: c.hex
        }
      })
      .composite([{ input: c.in, gravity: 'center' }])
      .png()
      .toFile(c.out);
      console.log(`Created ${c.out}`);
    } catch (err) {
      console.error(`Error processing ${c.in}:`, err);
    }
  }
}

createWideBanners();
