const sharp = require('sharp');

async function createWideBanners() {
  const configs = [
    { in: 'public/carousel_banner_1.png', out: 'public/wide_banner_1.png', hex: '#FAF5F0' },
    { in: 'public/carousel_banner_2.png', out: 'public/wide_banner_2.png', hex: '#F8EFEA' },
    { in: 'public/carousel_banner_3.png', out: 'public/wide_banner_3.png', hex: '#F5F0E6' },
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
      .composite([{ input: c.in, gravity: 'east' }])
      .png()
      .toFile(c.out);
      console.log(`Created ${c.out}`);
    } catch (err) {
      console.error(`Error processing ${c.in}:`, err);
    }
  }
}

createWideBanners();
