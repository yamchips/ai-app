import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  instructions?: string;
  maxTokens?: number;
  previousResponseId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText({
    model = 'gpt-5.4-mini',
    prompt,
    instructions,
    maxTokens = 300,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    const response = await openaiClient.responses.create({
      model,
      instructions,
      input: prompt,
      max_output_tokens: maxTokens,
      previous_response_id: previousResponseId,
    });
    return { id: response.id, text: response.output_text };
  },
  async summarize(text: string) {
    const output = await inferenceClient.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      provider: 'hf-inference',
    });
    return output.summary_text;
  },
};
