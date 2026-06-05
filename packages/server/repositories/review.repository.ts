import { PrismaClient, type Review } from '../generated/prisma/client';

export const reviewRepository = {
  async getReviews(productId: number): Promise<Review[]> {
    const prisma = new PrismaClient();

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  },
};
