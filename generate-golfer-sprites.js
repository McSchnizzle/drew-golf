const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_AI_API_KEY;

const avatars = [
  { id: '01', desc: 'boy, light skin, short brown hair' },
  { id: '02', desc: 'boy, light skin, blonde spiky hair' },
  { id: '03', desc: 'boy, medium skin, black curly hair' },
  { id: '04', desc: 'boy, tan skin, dark brown wavy hair' },
  { id: '05', desc: 'boy, dark skin, short black hair' },
  { id: '06', desc: 'boy, dark skin, fade haircut' },
  { id: '07', desc: 'girl, light skin, long blonde hair' },
  { id: '08', desc: 'girl, light skin, brown ponytail' },
  { id: '09', desc: 'girl, medium skin, black straight hair' },
  { id: '10', desc: 'girl, tan skin, dark curly hair' },
  { id: '11', desc: 'girl, dark skin, black braids' },
  { id: '12', desc: 'girl, dark skin, afro puffs' },
  { id: '13', desc: 'boy, light skin, red hair' },
  { id: '14', desc: 'boy, medium skin, mohawk' },
  { id: '15', desc: 'girl, light skin, pink pigtails' },
  { id: '16', desc: 'girl, medium skin, short bob haircut' },
  { id: '17', desc: 'boy, tan skin, long hair in ponytail' },
  { id: '18', desc: 'girl, tan skin, wavy brown hair with bangs' }
];

async function generateAvatar(avatar) {
  const prompt = `Create a simple flat cartoon avatar icon of a ${avatar.desc}.
Style: Simple like an emoji or Nintendo Mii - round head, dot eyes, curved smile, minimal details.
Must be: Flat colors only, no shading, no gradients, transparent background.
Face must have: two dot eyes and a happy curved smile/mouth.
Image size: exactly 128x128 pixels square.
Head should fill most of the frame.`;

  console.log(`  Generating...`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
        })
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error(`  ✗ ${data.error.message}`);
      return false;
    }

    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          const filename = `${avatar.id}-avatar.png`;
          fs.writeFileSync(path.join(__dirname, 'sprites', filename), buffer);
          console.log(`  ✓ Saved ${filename}`);
          return true;
        }
      }
    }
    console.log('  ✗ No image returned');
    return false;
  } catch (error) {
    console.error(`  ✗ ${error.message}`);
    return false;
  }
}

async function main() {
  const spritesDir = path.join(__dirname, 'sprites');

  // Clear old files
  const oldFiles = fs.readdirSync(spritesDir).filter(f => f.endsWith('.png'));
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(spritesDir, f));
  }
  console.log(`Cleared ${oldFiles.length} old files\n`);

  console.log(`Generating ${avatars.length} fresh avatars...\n`);

  let success = 0;
  for (let i = 0; i < avatars.length; i++) {
    console.log(`[${i + 1}/${avatars.length}] ${avatars[i].desc}`);
    if (await generateAvatar(avatars[i])) success++;
    await new Promise(r => setTimeout(r, 2500));
  }

  console.log(`\n✓ Done! Generated ${success}/${avatars.length} avatars.`);
}

main();
