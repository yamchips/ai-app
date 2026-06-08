import { type Review } from '../generated/prisma/client';
import { prisma } from '../prisma/client';

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return reviews;
  },
};
