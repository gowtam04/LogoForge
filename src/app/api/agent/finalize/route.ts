import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentFinalizeRequest, AgentFinalizeResponse, LogoStyle } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const SYSTEM_PROMPT = `Based on the following interview about a logo design project, create an optimized logo generation prompt.

Analyze the conversation and extract:
1. A concise but detailed logo description (2-3 sentences)
2. The most appropriate style
3. Any mentioned brand/app name
4. Any mentioned color preferences

Return ONLY valid JSON in this exact format:
{
  "prompt": "2-3 sentence professional logo description that captures the brand essence",
  "style": "minimalist|playful|corporate|mascot|any",
  "appName": "extracted name or null",
  "colorHints": "extracted colors or null"
}

Style definitions:
- minimalist: Clean, simple, minimal elements, negative space
- playful: Fun, energetic, vibrant, friendly
- corporate: Professional, trustworthy, sophisticated
- mascot: Character-based, memorable mascot
- any: Versatile, let AI decide based on context

Focus on creating a prompt that will generate a memorable, professional logo. Be specific and descriptive.`;

const VALID_STYLES: LogoStyle[] = ['minimalist', 'playful', 'corporate', 'mascot', 'any'];

export async function POST(request: Request) {
  try {
    const body: AgentFinalizeRequest = await request.json();
    const { answers } = body;

    // Validate request
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers array' },
        { status: 400 }
      );
    }

    // Build the interview context
    let interviewContext = 'Interview:\n';
    answers.forEach((qa, index) => {
      interviewContext += `Q${index + 1}: ${qa.question}\n`;
      interviewContext += qa.answer
        ? `A${index + 1}: ${qa.answer}\n\n`
        : `A${index + 1}: [Skipped]\n\n`;
    });

    const prompt = `${SYSTEM_PROMPT}

${interviewContext}

Generate the JSON response:`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Parse and validate the response
    let parsedResponse: AgentFinalizeResponse;
    try {
      const parsed = JSON.parse(jsonStr);

      // Validate and sanitize the response
      parsedResponse = {
        prompt: typeof parsed.prompt === 'string' && parsed.prompt.length > 0
          ? parsed.prompt
          : generateFallbackPrompt(answers),
        style: VALID_STYLES.includes(parsed.style) ? parsed.style : 'any',
        appName: typeof parsed.appName === 'string' && parsed.appName.length > 0
          ? parsed.appName
          : undefined,
        colorHints: typeof parsed.colorHints === 'string' && parsed.colorHints.length > 0
          ? parsed.colorHints
          : undefined,
      };
    } catch {
      // If JSON parsing fails, construct a basic response from answers
      parsedResponse = generateFallbackResponse(answers);
    }

    return NextResponse.json(parsedResponse);
  } catch {
    // Try to generate a fallback response
    try {
      const body = await request.clone().json();
      const fallbackResponse = generateFallbackResponse(body.answers || []);
      return NextResponse.json(fallbackResponse);
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate prompt. Please try again.' },
        { status: 500 }
      );
    }
  }
}

/**
 * Generates a fallback prompt from the interview answers
 */
function generateFallbackPrompt(answers: AgentFinalizeRequest['answers']): string {
  const answeredQuestions = answers.filter(a => a.answer && a.answer.trim().length > 0);

  if (answeredQuestions.length === 0) {
    return 'Create a professional, modern logo with clean design elements.';
  }

  // Combine the first few meaningful answers into a prompt
  const parts = answeredQuestions
    .slice(0, 3)
    .map(a => a.answer.trim())
    .filter(a => a.length > 0);

  return `Create a logo for: ${parts.join('. ')}`;
}

/**
 * Generates a complete fallback response when AI fails
 */
function generateFallbackResponse(answers: AgentFinalizeRequest['answers']): AgentFinalizeResponse {
  const answersText = answers
    .filter(a => a.answer && a.answer.trim())
    .map(a => a.answer.toLowerCase())
    .join(' ');

  // Try to infer style from answers
  let style: LogoStyle = 'any';
  if (/minimalist|clean|simple|minimal/i.test(answersText)) {
    style = 'minimalist';
  } else if (/playful|fun|friendly|energetic|vibrant/i.test(answersText)) {
    style = 'playful';
  } else if (/corporate|professional|business|serious|trustworthy/i.test(answersText)) {
    style = 'corporate';
  } else if (/mascot|character|animal|person|figure/i.test(answersText)) {
    style = 'mascot';
  }

  // Try to extract app name (look for quoted text or "called X" patterns)
  let appName: string | undefined;
  const nameMatch = answersText.match(/called ["']?([^"'\n,]+)["']?/i) ||
    answersText.match(/named ["']?([^"'\n,]+)["']?/i) ||
    answersText.match(/["']([^"'\n]+)["']/);
  if (nameMatch) {
    appName = nameMatch[1].trim();
  }

  // Try to extract colors
  let colorHints: string | undefined;
  const colorKeywords = [
    'blue', 'red', 'green', 'yellow', 'orange', 'purple', 'pink',
    'black', 'white', 'gray', 'grey', 'gold', 'silver', 'teal',
    'navy', 'coral', 'indigo', 'violet', 'cyan', 'magenta'
  ];
  const foundColors = colorKeywords.filter(c => answersText.includes(c));
  if (foundColors.length > 0) {
    colorHints = foundColors.join(', ');
  }

  return {
    prompt: generateFallbackPrompt(answers),
    style,
    appName,
    colorHints,
  };
}
