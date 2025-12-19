const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_AI_API_KEY;

async function generateGolferSprite(description, filename) {
  const prompt = `Create a cartoon golfer character sprite for a mobile golf game. ${description}.
  Style: Cute, colorful, 2D cartoon style similar to Clash Royale or Golf Clash characters.
  Requirements:
  - Transparent background (PNG)
  - Full body visible
  - Clean cartoon style with bold outlines
  - Friendly, appealing design
  - No text or watermarks
  - Simple enough for a game sprite`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an image: ${prompt}`
          }]
        }],
        generationConfig: {
          responseModalities: ["image", "text"],
          responseMimeType: "image/png"
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(path.join(__dirname, 'sprites', filename), buffer);
          console.log(`Generated: ${filename}`);
          return true;
        }
      }
    }

    console.log('Response:', JSON.stringify(data, null, 2));
    return false;
  } catch (error) {
    console.error(`Error generating ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  // Create sprites directory
  const spritesDir = path.join(__dirname, 'sprites');
  if (!fs.existsSync(spritesDir)) {
    fs.mkdirSync(spritesDir);
  }

  const sprites = [
    {
      desc: "Male golfer standing in idle pose, wearing red polo shirt and khaki pants, holding golf club, light skin tone",
      file: "golfer-male-idle.png"
    },
    {
      desc: "Male golfer in backswing pose with golf club raised, wearing red polo shirt and khaki pants, light skin tone",
      file: "golfer-male-swing.png"
    },
    {
      desc: "Female golfer standing in idle pose, wearing pink polo shirt and navy skirt, holding golf club, light skin tone, ponytail hairstyle",
      file: "golfer-female-idle.png"
    },
    {
      desc: "Female golfer in backswing pose with golf club raised, wearing pink polo shirt and navy skirt, light skin tone, ponytail hairstyle",
      file: "golfer-female-swing.png"
    }
  ];

  console.log('Generating golfer sprites with Gemini...\n');

  for (const sprite of sprites) {
    await generateGolferSprite(sprite.desc, sprite.file);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\nDone!');
}

main();
