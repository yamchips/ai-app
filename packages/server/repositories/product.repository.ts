import { prisma } from '../prisma/client';

export const productRepository = {
  getProductById(productId: number) {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
