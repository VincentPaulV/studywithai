import { getTopChunks } from '@/app/lib/ragSearch';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: Request) {
  const { numberOfSessions, subject, durationHours, startDate, endDate, availability } = await req.json();

  const topChunks = await getTopChunks(
    `Generate a structured ${numberOfSessions}-session course plan for ${subject}`,
    5
  );

  console.log("🔍 First chunk sample:\n", topChunks[0]);

  const prompt = `
You are an AI educational planner.

The user has uploaded textbook material to generate a custom course plan.

## USER INPUTS:
- Subject: ${subject}
- Total Sessions: ${numberOfSessions}
- Each Session Duration: ${durationHours} hours
- Start Date: ${startDate}
- End Date: ${endDate}
- Weekly Availability: ${availability?.length > 0 ? JSON.stringify(availability) : "N/A"}

## INSTRUCTIONS:
1. Use the textbook content below to extract important concepts.
2. Create exactly ${numberOfSessions} sessions, spaced logically based on content.
3. Each session must follow this format exactly (for compatibility with automation):

## Session X: [Concise Title]

- **Summary:** A short 2-3 line explanation of what the session covers.
- **Key Concepts:** Bullet points of core topics/concepts covered.
- **Checkpoint/Quiz Topics:** What the learner should review or be tested on after this session.

4. Use chapters in logical order. If content is too short for one session, combine related topics logically.
5. Avoid week numbers, vague time markers, or headings other than '## Session X: Title'.
6. Do not use tables or markdown formatting like "| Session | Summary |". This will break automation.

## Example Output:
## Session 1: Linear Regression
- **Summary:** Introduction to linear regression and how it models relationships using least squares.
- **Key Concepts:**
  - Linear equations
  - Matrix derivatives
  - Least squares method
- **Checkpoint/Quiz Topics:**
  - Deriving gradients
  - Interpreting coefficients

## TEXTBOOK CONTENT:
${topChunks.join('\n\n')}

Return only the list of sessions in the format above. No intro, no notes, no headings — only sessions.

`;

  const gemmaResponse = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gemma:2b", prompt, stream: false }),
  });

  const result = await gemmaResponse.json();

  return Response.json({ result: result.response });
}
