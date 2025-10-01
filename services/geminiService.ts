import { GoogleGenAI, Type } from "@google/genai";
import { Language, SummarizationStyle, AIResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateContentFromUrl = async (
  url: string,
  language: Language,
  style: SummarizationStyle,
  lengths: (keyof AIResult['summaries'])[]
): Promise<AIResult> => {

  if (lengths.length === 0) {
    throw new Error('Please select at least one summary length.');
  }

  const summaryProperties: { [key: string]: { type: Type.STRING, description: string } } = {};
    lengths.forEach(key => {
      const words = key.substring(1);
      summaryProperties[key] = { type: Type.STRING, description: `A ${words}-word summary.` };
    });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summaries: {
        type: Type.OBJECT,
        properties: summaryProperties,
        required: lengths,
      },
      titles: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 5 concise and catchy titles.',
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 10 relevant hashtags/keywords for YouTube or TikTok.',
      },
    },
    required: ['summaries', 'titles', 'tags'],
  };

  const summaryList = lengths.map(key => {
    const words = key.substring(1);
    return `*   A ${words}-word summary.`;
  }).join('\n');

  const prompt = `
    Based on the content from the article at this URL: ${url}

    Please perform the following tasks. The output for all generated content must be in ${language}. The desired tone is ${style}.

    1.  **Summaries**: Generate ${lengths.length > 1 ? 'these summaries' : 'this summary'} of the article with the following approximate word counts:
        ${summaryList}

    2.  **Titles**: Generate 5 concise, catchy, and view-grabbing titles for this content.

    3.  **Tags**: Generate 10 relevant hashtags or keywords suitable for increasing views on platforms like YouTube or TikTok.

    Return the result strictly in the requested JSON format. Do not add any explanatory text before or after the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    // Basic validation to ensure the structure is as expected
    if (
      !parsedResult.summaries ||
      !parsedResult.titles ||
      !parsedResult.tags
    ) {
      throw new Error('Invalid response structure from AI.');
    }
    
    return parsedResult as AIResult;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating content.');
  }
};