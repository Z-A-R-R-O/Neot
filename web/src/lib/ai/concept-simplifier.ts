import { aiService } from "./ai-service";

export interface SimplifyResult {
  simplified: string;
  analogy: string | null;
  level: string;
  generatedAt: string;
}

function buildPrompt(conceptTitle: string, conceptDescription: string | null, level: string): string {
  const levelDescriptions: Record<string, string> = {
    eli5: "Explain like I'm 5 years old. Use the simplest possible words. One short paragraph.",
    kid: "Explain like I'm 10 years old. Simple words, short sentences, fun examples. 2-3 paragraphs.",
    teen: "Explain like I'm a teenager. Can use some technical terms but explain them. Include a real-world example.",
    normal: "Explain at a standard adult level. Clear, concise, with proper terminology. 2-3 paragraphs.",
    detailed: "Provide a comprehensive explanation. Include technical depth, edge cases, and connections to other concepts.",
  };

  const description = conceptDescription ?? "A concept to learn";
  const instruction = levelDescriptions[level] ?? levelDescriptions.normal;

  return `Simplify the concept "${conceptTitle}" for me.

Context: ${description}

${instruction}

Also provide a short, memorable real-world analogy that captures the essence of this concept.

Format your response as:
SIMPLE: [The simplified explanation]

ANALOGY: [A short real-world analogy]`;
}

function buildAnalogyPrompt(conceptTitle: string, conceptDescription: string | null): string {
  const desc = conceptDescription ?? "a concept";
  return `Find a creative, memorable real-world analogy for the concept "${conceptTitle}" (${desc}).

The analogy should:
- Be relatable to everyday life
- Capture the core idea accurately
- Be easy to remember
- Be no longer than 2-3 sentences

Respond with just the analogy.`;
}

const SIMPLIFY_CACHE_PREFIX = "simplify_v1";

export async function simplifyConcept(
  conceptTitle: string,
  conceptDescription: string | null,
  level: string = "teen",
  userId: string = "anonymous",
): Promise<SimplifyResult> {
  const prompt = buildPrompt(conceptTitle, conceptDescription, level);
  const cacheKey = `${SIMPLIFY_CACHE_PREFIX}:${conceptTitle}:${level}`;

  try {
    const raw = await aiService.generate("simplify", prompt, userId, cacheKey);
    const simpleMatch = raw.match(/SIMPLE:\s*([\s\S]*?)(?=ANALOGY:|$)/);
    const analogyMatch = raw.match(/ANALOGY:\s*(.+)/);

    const simplified = simpleMatch?.[1]?.trim() ?? raw;
    const analogy = analogyMatch?.[1]?.trim() ?? null;

    return { simplified, analogy, level, generatedAt: new Date().toISOString() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return {
      simplified: `${conceptTitle}: ${conceptDescription ?? "An interesting concept to learn."}\n\n*${message}*\n\nConfigure an AI provider to enable concept simplification.`,
      analogy: null,
      level,
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function generateAnalogy(
  conceptTitle: string,
  conceptDescription: string | null,
  userId: string = "anonymous",
): Promise<string> {
  const prompt = buildAnalogyPrompt(conceptTitle, conceptDescription);
  const cacheKey = `analogy_v1:${conceptTitle}`;

  try {
    return await aiService.generate("simplify", prompt, userId, cacheKey);
  } catch {
    return `${conceptTitle} is like... well, it's a unique concept! Configure an AI provider for creative analogies.`;
  }
}

export function simplifyFallback(conceptTitle: string, description: string | null, level: string): SimplifyResult {
  const desc = description ?? "a learning concept";
  const simplified = `**${conceptTitle}**

${desc}

*This is a placeholder simplification. Connect an AI provider for adaptive explanations.*`;

  const analogy = `${conceptTitle} is like building with LEGO blocks — each piece builds on the previous one.`;

  return { simplified, analogy, level, generatedAt: new Date().toISOString() };
}
