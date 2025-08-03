import { getTopChunks } from '@/app/lib/ragSearch';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'nodejs', // Use Node runtime instead of Edge
};

export async function POST(req: Request) {
  const { subject, classLevel, durationWeeks, startDate } = await req.json();

  const contextChunks = await getTopChunks(
    `Create a course plan for Class ${classLevel} ${subject}`,
    5
  );

  const prompt = `
You are an AI tutor.

Generate a course outline and 6-week plan using the textbook content and user inputs.

User Inputs:
- Class: ${classLevel}
- Subject: ${subject}
- Duration: ${durationWeeks} weeks
- Start Date: ${startDate}

Textbook Content:
${contextChunks.join("\n\n")}

Give weekly breakdown with topics and checkpoints.
`;

  const gemmaResponse = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gemma:latest", prompt, stream: false }),
  });

  const result = await gemmaResponse.json();
  return Response.json({ result: result.response });
}


