import { type Review } from '../generated/prisma/client';
import { prisma } from '../prisma/client';

export const reviewRepository = {
  async getReviews(productId: number): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  },
};
