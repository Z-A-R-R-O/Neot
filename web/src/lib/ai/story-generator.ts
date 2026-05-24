import { aiService } from "./ai-service";

export interface StoryResult {
  story: string;
  title: string;
  difficulty: string;
  generatedAt: string;
}

function buildPrompt(conceptTitle: string, conceptDescription: string | null, difficulty: string, studentLevel: string, interests: string[]): string {
  const diffInstructions: Record<string, string> = {
    simple: "Use very simple language suitable for a 10-year-old. Short sentences. No jargon without explanation.",
    normal: "Use language suitable for a teenager. Can use some technical terms with brief explanations.",
    advanced: "Use detailed technical language suitable for an adult learner. Include deeper insights and connections.",
  };

  const instruction = diffInstructions[difficulty] ?? diffInstructions.normal;
  const interestContext = interests.length > 0
    ? `The student is interested in: ${interests.join(", ")}. Try to incorporate these interests into the story if relevant.`
    : "";

  return `You are an expert educational storyteller. Create a short, engaging narrative that explains the concept "${conceptTitle}".

Concept description: ${conceptDescription ?? "A learning concept"}

${instruction}
${interestContext}

The story should:
1. Have a clear title
2. Be 3-5 paragraphs long
3. Explain the concept through a relatable analogy or narrative
4. End with a brief "What we learned" summary
5. Be engaging and memorable

Format your response as:
TITLE: [Story Title]

[Story content]`;
}

const STORY_CACHE_PREFIX = "story_v1";

export async function generateStory(
  conceptTitle: string,
  conceptDescription: string | null,
  difficulty: string = "normal",
  studentLevel: string = "teen",
  interests: string[] = [],
  userId: string = "anonymous",
): Promise<StoryResult> {
  const prompt = buildPrompt(conceptTitle, conceptDescription, difficulty, studentLevel, interests);
  const cacheKey = `${STORY_CACHE_PREFIX}:${conceptTitle}:${difficulty}:${studentLevel}`;

  try {
    const raw = await aiService.generate("story", prompt, userId, cacheKey);
    const lines = raw.trim().split("\n");
    const titleLine = lines.find((l) => l.startsWith("TITLE:"));
    const title = titleLine?.replace("TITLE:", "").trim() ?? `The Story of ${conceptTitle}`;
    const story = lines.filter((l) => !l.startsWith("TITLE:")).join("\n").trim();

    return { story, title, difficulty, generatedAt: new Date().toISOString() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return {
      story: `## ${conceptTitle}\n\n*${message}*\n\nConfigure an AI provider (e.g. OPENAI_API_KEY) to enable story generation.`,
      title: `About ${conceptTitle}`,
      difficulty,
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function generateStoryFallback(conceptTitle: string, description: string | null): Promise<StoryResult> {
  const title = `The Tale of ${conceptTitle}`;
  const desc = description ?? "an interesting concept";
  const story = `# ${title}

Once upon a time, in the world of learning, there was a concept called **${conceptTitle}**.

${desc}

## What We Learned
- ${conceptTitle} is a fascinating concept
- Understanding it opens doors to new knowledge
- Practice makes perfect!

*This is a placeholder story. Connect an AI provider for rich, personalized narratives.*`;

  return { story, title, difficulty: "normal", generatedAt: new Date().toISOString() };
}
