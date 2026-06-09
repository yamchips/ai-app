import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
  const [reviewData, setReviewData] = useState<GetReviewsResponse>();
  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    setReviewData(data);
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <div>
      {reviewData?.reviews.map((review) => (
        <div key={review.id}>
          <div className="font-semibold">{review.author}</div>
          <div>Rating: {review.rating}</div>
          <p className="py-2">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
