# NOVA Starter Template — Generator Tool

Use this template when your tool produces something the user takes away and uses immediately.

## Best for
- Script generators
- Itinerary generators
- Email generators
- Meal plan generators
- Proposal generators
- Bio generators
- Any tool where the output is ready to use with minimal editing

## Key difference from scorer and diagnostic
Generator tools use higher temperature (0.7-0.9) because variety is the point.
The output format is usually plain text, not JSON, because it gets read or sent as a whole.

## What to customize

### 1. System prompt (api/index.js)
- ROLE: your specific expert identity
- TASK: what you are generating and the structure of the output
- CONTEXT: who your user is and what quality they expect
- CONSTRAINTS: what to avoid, tone and style rules
- FORMAT: the exact section labels and structure of your output

### 2. Output format choice
The template defaults to plain text (r.output). 
If you need JSON output, uncomment the JSON parsing code in the API and update displayResults() in the HTML.

### 3. Brand tokens (public/index.html)
Update the :root CSS variables with your values from the Brand Token Cheatsheet.

### 4. Input fields
Update, add, or remove input fields to match what your system prompt needs.
The user input string in handleSubmit() should include all fields your prompt uses.

### 5. Content
- Header: tag, title, subtitle, credibility signal
- Form: field labels, hints, placeholders, select options
- Loading text
- Footer: brand name and URL

### 6. Email capture
Uncomment and implement the captureEmail() call in handleGate().
See Module 4 Lesson 4.5 for the full implementation.

## Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: ANTHROPIC_API_KEY
4. Deploy

## Temperature
Recommended: 0.7 to 0.9 for creative variety in generated outputs
