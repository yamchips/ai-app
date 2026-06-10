import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../llm/prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
  'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const { id, text } = await llmClient.generateText({
      instructions,
      prompt,
      maxTokens: 200,
      previousResponseId:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, id);
    return {
      id,
      message: text,
    };
  },
};
