import { NextResponse } from "next/server";

import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `You are NEOT AI Tutor, a helpful and patient learning assistant. You guide students through concepts without giving direct answers. Use the Socratic method: ask questions, provide hints, and encourage critical thinking.

Rules:
- Never give direct answers to quiz questions or homework
- Explain concepts in simple, age-appropriate language
- Use examples and analogies
- If the student is stuck, break the problem into smaller steps
- Be encouraging and positive
- Keep responses concise (under 200 words unless explaining a complex concept)
- If asked about something unrelated to learning, politely redirect to educational topics`;

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { message, context } = body;

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const lessonContext = context?.lessonId
    ? await getLessonContext(context.lessonId)
    : "";

  const masteryContext = context?.lessonId
    ? await getMasteryContext(userId, context.lessonId)
    : "";

  const userPrompt = `
Context:
${lessonContext}
${masteryContext}

Student question: ${message}
`;

  if (!OPENAI_API_KEY) {
    const fallbackResponse = generateFallbackResponse(message, lessonContext);
    await logInteraction(userId, message, fallbackResponse, context);
    return NextResponse.json({ response: fallbackResponse });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content ?? "I'm not sure how to help with that. Can you rephrase your question?";

    await logInteraction(userId, message, aiResponse, context);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    const fallbackResponse = generateFallbackResponse(message, lessonContext);
    await logInteraction(userId, message, fallbackResponse, context);
    return NextResponse.json({ response: fallbackResponse });
  }
}

async function getLessonContext(lessonId: string): Promise<string> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { title: true, description: true, content: true },
  });

  if (!lesson) return "";

  return `Current lesson: "${lesson.title}"${lesson.description ? ` - ${lesson.description}` : ""}`;
}

async function getMasteryContext(userId: string, lessonId: string): Promise<string> {
  const lessonSkills = await prisma.lessonSkill.findMany({
    where: { lessonId },
    include: { skill: true },
  });

  if (lessonSkills.length === 0) return "";

  const masteryRecords = await prisma.skillMastery.findMany({
    where: {
      userId,
      skillId: { in: lessonSkills.map((ls) => ls.skillId) },
    },
    select: { skillId: true, score: true },
  });

  const masteryMap = new Map(masteryRecords.map((r) => [r.skillId, r.score]));

  const skillContext = lessonSkills
    .map((ls) => `${ls.skill.name}: ${Math.round((masteryMap.get(ls.skillId) ?? 0) * 100)}% mastery`)
    .join(", ");

  return `Related skills: ${skillContext}`;
}

function generateFallbackResponse(message: string, context: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("help") || lower.includes("explain")) {
    return "I'd be happy to help! Let me break this down for you. What specific part are you finding confusing?";
  }

  if (lower.includes("what is") || lower.includes("define")) {
    return "That's a great question! Think about what you already know about this topic. What comes to mind when you hear this term?";
  }

  if (lower.includes("how do i") || lower.includes("how to")) {
    return "Let's work through this step by step. What have you tried so far?";
  }

  if (lower.includes("answer") || lower.includes("solution")) {
    return "I can't give you the answer directly, but I can help you figure it out! What do you think the first step should be?";
  }

  return "That's an interesting question! Can you tell me more about what you're trying to understand?";
}

async function logInteraction(
  userId: string,
  question: string,
  response: string,
  context?: { lessonId?: string },
) {
  try {
    await prisma.platformSetting.updateMany({
      where: { key: `ai_tutor_log_${userId}` },
      data: {
        value: JSON.stringify({
          question,
          response: response.slice(0, 200),
          lessonId: context?.lessonId ?? null,
          timestamp: new Date().toISOString(),
        }),
      },
    });
  } catch {
    // Logging is non-critical
  }
}
