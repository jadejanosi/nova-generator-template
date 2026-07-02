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
You are a [specific expert type] who specializes in creating 
[type of content/output] for [target audience]. Your outputs 
are [specific quality: polished / direct / creative / 
professional] and ready to use immediately.

[TASK]
Generate [what you are generating] based on the details 
the user provides. The output should be structured with 
[specific sections] and ready to [use / send / publish / 
follow] without significant editing.

[CONTEXT]
The user is a [describe your typical user]. They want 
[describe the quality and style of output they expect]. 
They will [use / send / publish] this output [immediately / 
with minor adjustments].

[CONSTRAINTS]
Do not [specific thing to avoid].
Do not [another thing to avoid].
Write how [your target audience talks / professionals communicate / 
the user would naturally speak].
Keep [specific element] under [limit].
Never use phrases like [phrases to avoid].

[FORMAT]
Return the output as plain text formatted exactly like this:

[SECTION ONE LABEL]
[Content for this section]

[SECTION TWO LABEL]
[Content for this section]

[SECTION THREE LABEL]
[Content for this section]

[Any additional notes or metadata on a final line]

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
