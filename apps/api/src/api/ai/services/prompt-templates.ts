/**
 * AI Prompt Templates
 * Typed templates for all AI operations with Islamic content guidelines.
 */

export const SYSTEM_CONTEXT = `You are an AI assistant for Masjid At-Taqwa, an Islamic educational institution serving the American Muslim community. You analyze educational content related to Islamic studies including Quran, Hadith, Fiqh, Seerah, Aqeedah, Arabic language, and Islamic ethics.

Guidelines:
- Respect all schools of thought (madhahib) in Islam. Do not flag legitimate scholarly differences.
- Be sensitive to the diversity of the American Muslim community.
- When uncertain about Islamic content accuracy, err on the side of caution and flag for human review.
- Focus on educational quality and age-appropriateness.`;

export const MODERATION_PROMPT = (content: string, contentType: string, ageTier?: string) => `
Analyze the following ${contentType} content for moderation. ${ageTier ? `This content is targeted at the "${ageTier}" age tier.` : ''}

Content to analyze:
---
${content}
---

Evaluate the content for these criteria:
1. ACCURACY: Are Quranic references, Hadith citations, and Islamic rulings accurately represented?
2. AGE_APPROPRIATENESS: Is the content suitable for the target age tier?
3. CULTURAL_SENSITIVITY: Does the content respect Islamic values and the American Muslim community?
4. QUALITY: Is the content well-structured, clear, and educational?
5. SAFETY: Does the content contain anything harmful, misleading, or inappropriate?

Respond in valid JSON format only:
{
  "score": <float 0.0-1.0, where 1.0 is completely safe>,
  "flags": [
    {
      "type": "<ACCURACY|AGE_APPROPRIATENESS|CULTURAL_SENSITIVITY|QUALITY|SAFETY>",
      "severity": "<low|medium|high|critical>",
      "description": "<brief explanation>"
    }
  ],
  "reasoning": "<2-3 sentence summary of the analysis>",
  "recommendation": "<approve|needs_review|reject>"
}`;

export const SUMMARIZATION_PROMPT = (content: string) => `
Summarize the following Islamic educational content in 2-3 clear, concise sentences. Preserve key Islamic terminology and concepts. The summary should help students quickly understand what the lesson covers.

Content:
---
${content}
---

Respond with the summary text only, no formatting or labels.`;

export const TAGGING_PROMPT = (content: string, title: string) => `
Analyze the following Islamic educational content and suggest appropriate tags and categorization.

Title: ${title}
Content:
---
${content}
---

Respond in valid JSON format only:
{
  "subject": "<quran|arabic|fiqh|hadith|seerah|aqeedah|akhlaq|tajweed>",
  "difficulty": "<beginner|intermediate|advanced>",
  "ageTier": "<children|youth|adults|seniors>",
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
}`;

export const QUIZ_GENERATION_PROMPT = (content: string, questionCount: number, difficulty: string) => `
Generate ${questionCount} multiple-choice quiz questions based on the following Islamic educational content. Difficulty level: ${difficulty}.

Content:
---
${content}
---

Requirements:
- Questions should test understanding, not just memorization
- Each question must have exactly 4 options
- Provide a clear explanation for each correct answer
- Include relevant Islamic references where appropriate
- Questions should be appropriate for the content's difficulty level

Respond in valid JSON format only:
{
  "questions": [
    {
      "question": "<question text>",
      "type": "multiple_choice",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctAnswer": "<exact text of correct option>",
      "explanation": "<why this is correct, with Islamic reference if applicable>",
      "points": 10
    }
  ]
}`;

