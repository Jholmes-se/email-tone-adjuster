import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { email, tone, toneDescription } = await request.json();

    if (!email || !tone) {
      return NextResponse.json(
        { error: "Email and tone are required" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Rewrite the following email to have a ${tone.toLowerCase()} tone (${toneDescription.toLowerCase()}). 

Keep the core message and all important information intact, but adjust the language, word choice, and style to match the requested tone.

Return ONLY the rewritten email with no preamble, explanation, or commentary.

Original email:
${email}`,
        },
      ],
    });

    const result = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ adjustedEmail: result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
