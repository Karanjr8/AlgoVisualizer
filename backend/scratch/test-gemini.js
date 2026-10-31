const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const key = process.env.GEMINI_API_KEY;
console.log('Testing key prefix:', key ? key.substring(0, 8) + '...' : 'NONE');

const modelsToTry = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite'
];

async function run() {
  for (const m of modelsToTry) {
    try {
      console.log(`Trying ${m}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
      const res = await axios.post(url, {
        contents: [{ role: 'user', parts: [{ text: 'Reply JSON: {"status":"ready"}' }] }],
        generationConfig: { responseMimeType: 'application/json' }
      }, { timeout: 8000 });
      console.log(`SUCCESS with ${m}:`, res.data.candidates[0].content.parts[0].text);
      return m;
    } catch (e) {
      console.log(`${m} error:`, e.response ? e.response.status + ' ' + (e.response.data?.error?.message || '') : e.message);
    }
  }
}
run();
