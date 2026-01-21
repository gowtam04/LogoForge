import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentInterviewRequest, AgentInterviewResponse } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 8;

const SYSTEM_PROMPT = `You are a professional logo design consultant conducting a brief interview to understand the client's brand and vision.

Your goal is to gather information to create a perfect logo generation prompt. Ask ONE focused question at a time, building naturally on previous answers.

Question strategy (adapt based on context and what's already been answered):
1. Business/brand purpose - What is the app/brand about?
2. Target audience - Who will use this?
3. Brand personality/values - What feeling should it convey?
4. Visual style preferences - Modern, classic, playful, professional?
5. **REQUIRED** Color preferences - Any specific colors, color palette, or color mood?
6. Specific elements - Any symbols, letters, or imagery to include/avoid?

Rules:
- Keep questions concise (under 25 words)
- Be conversational and friendly
- Build on previous answers to ask relevant follow-ups
- Don't repeat topics already covered
- You MUST ask about color preferences at some point during the interview - this is essential for logo design
- Return ONLY the question text, nothing else`;

export async function POST(request: Request) {
  try {
    const body: AgentInterviewRequest = await request.json();
    const { previousAnswers, currentStep } = body;

    // Validate request
    if (currentStep < 0 || currentStep > MAX_QUESTIONS) {
      return NextResponse.json(
        { error: 'Invalid step number' },
        { status: 400 }
      );
    }

    // Determine if this should be the last question
    const isLastQuestion = currentStep >= MIN_QUESTIONS - 1 && (
      currentStep >= MAX_QUESTIONS - 1 ||
      hasEnoughInformation(previousAnswers)
    );

    // Build the conversation context
    let conversationContext = '';
    if (previousAnswers.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n';
      previousAnswers.forEach((qa, index) => {
        conversationContext += `Q${index + 1}: ${qa.question}\n`;
        conversationContext += qa.answer
          ? `A${index + 1}: ${qa.answer}\n`
          : `A${index + 1}: [Skipped]\n`;
      });
    }

    const prompt = `${SYSTEM_PROMPT}
${conversationContext}

Current step: ${currentStep + 1}/${MAX_QUESTIONS}
${isLastQuestion ? 'This is the final question. Make it count - ask about any important aspect not yet covered.' : ''}

Generate the next question:`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const question = response.text().trim();

    // Clean up the question (remove any quotes or extra formatting)
    const cleanedQuestion = question
      .replace(/^["']|["']$/g, '')
      .replace(/^Q\d+:\s*/i, '')
      .trim();

    const responseData: AgentInterviewResponse = {
      question: cleanedQuestion || getFallbackQuestion(currentStep),
      isLastQuestion,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Interview API error:', error);

    // Return a fallback question on error
    const body = await request.clone().json().catch(() => ({ currentStep: 0 }));
    const fallbackQuestion = getFallbackQuestion(body.currentStep || 0);

    return NextResponse.json({
      question: fallbackQuestion,
      isLastQuestion: body.currentStep >= MIN_QUESTIONS - 1,
    });
  }
}

/**
 * Checks if we have enough information to generate a good prompt
 */
function hasEnoughInformation(answers: AgentInterviewRequest['previousAnswers']): boolean {
  const answeredCount = answers.filter(a => a.answer && a.answer.trim().length > 0).length;
  // Need at least 3 substantive answers
  return answeredCount >= 3;
}

/**
 * Returns a fallback question if AI generation fails
 */
function getFallbackQuestion(step: number): string {
  const fallbackQuestions = [
    "What is your app or brand about? What does it do?",
    "Who is your target audience? Who will be using this?",
    "What personality should your logo convey - professional, playful, modern, or something else?",
    "Do you have any color preferences for your logo?",
    "Are there any specific symbols, shapes, or elements you'd like included or avoided?",
    "Is there anything else about your brand vision you'd like to share?",
  ];

  return fallbackQuestions[step] || fallbackQuestions[fallbackQuestions.length - 1];
}
