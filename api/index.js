// ============================================================
// NOVA STARTER TEMPLATE — GENERATOR TOOL
// ============================================================
// This serverless function calls the Claude API and returns
// a structured plain text output ready for the user to use.
//
// WHAT TO CHANGE:
// 1. The system prompt (marked with CUSTOMIZE below)
// 2. The output format in the prompt (plain text or JSON)
// 3. The temperature (0.7-0.9 for creative variety)
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CUSTOMIZE: match field names to what your frontend sends
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'Input is required' });
  }

  // ============================================================
  // SYSTEM PROMPT — CUSTOMIZE THIS FOR YOUR TOOL
  // ============================================================
  // Generator tools often return plain text rather than JSON.
  // The output should be ready for the user to copy and use
  // immediately with minimal editing.
  // ============================================================
  const systemPrompt = `
[ROLE]
You are a social media copywriter who specializes in writing Instagram hooks for food and recipe content that stop the scroll and make people want to save the post immediately. 

[TASK]
Your task is to generate 5 hook options for the topic the user provides. Each hook should use a different psychological trigger.

[FORMAT]
Return 5 hooks as a numbered list. After each hook add the trigger type in brackets.

Do not add any preamble, introduction, or closing summary.
Return only the formatted output.
`;

// ============================================================
// ALTERNATIVE: JSON FORMAT
// Use this instead of plain text if your tool needs to display
// different parts of the output in different places in the UI
// ============================================================
// const systemPrompt = `
// ...
// Return ONLY a valid JSON object with these exact keys.
// No markdown. No explanation. No text outside the JSON.
// {
//   "section_one": "[content]",
//   "section_two": "[content]",
//   "section_three": "[content]",
//   "notes": "[any additional notes]"
// }
// `;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userInput }],
        // CUSTOMIZE: higher temperature = more variety in outputs
        // Recommended range for generators: 0.7 to 0.9
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || 'Claude API error'
      });
    }

    // For plain text output, return as a string
    const output = data.content[0].text.trim();
    return res.status(200).json({ output });

    // UNCOMMENT BELOW if using JSON format instead:
    // const raw = data.content[0].text.trim();
    // const clean = raw.replace(/```json|```/g, '').trim();
    // const result = JSON.parse(clean);
    // return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
}
