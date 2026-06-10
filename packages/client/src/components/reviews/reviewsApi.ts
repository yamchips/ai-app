import axios from 'axios';

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

export type GetSummaryResponse = {
  summary: string;
};

export const reviewsApi = {
  async fetchReviews(productId: number) {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  },
  async summarizeReviews(productId: number) {
    const { data } = await axios.post<GetSummaryResponse>(
      `/api/products/${productId}/reviews/summarize`
    );
    return data;
  },
};
