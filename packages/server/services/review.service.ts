import OpenAI from 'openai';
import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    const reviews = reviewRepository.getReviews(productId);
    return reviews;
  },
  async summarizeReviews(productId: number): Promise<string> {
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');
    // return 'placeholder for now';
    const prompt = `Summarize the product's feature based on following customer reviews, both positive and negative:
      
    ${joinedReviews}`;
    const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
    });
    return response.output_text;
  },
};
