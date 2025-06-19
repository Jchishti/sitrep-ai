// File: lib/gpt-generator.js
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config(); // Load OPENAI_API_KEY from .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTestPlan(domSnapshot) {
  const prompt = `
You're a senior QA strategist.
Analyze this DOM structure and generate a list of possible tests.
Prioritize them by value to the end-user experience (i.e., navigation, form functionality, content visibility).

Only return a clean markdown list, sorted by priority. Each item should:
- State what to test
- Briefly explain why it matters to users
- Suggest what kind of Playwright selector you'd use (getByRole, getByLabel, etc.)

DOM Snapshot:
${JSON.stringify(domSnapshot, null, 2)}
`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return chat.choices[0].message.content.trim();
}

export async function generateTestFromPlan(planMarkdown, url) {
  const prompt = `
You are a Playwright test engineer.
Given the test strategy below and a known target URL, write a TypeScript Playwright test suite.
Focus on covering the top 3-5 most valuable tests.
Return only valid TypeScript test code.

URL: ${url}

Test Plan:
${planMarkdown}
`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  return chat.choices[0].message.content.trim();
}