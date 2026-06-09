import axios from 'axios';
import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

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

type GetSummaryResponse = {
  summary: string;
};

const ReviewList = ({ productId }: Props) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const handleSummarize = async () => {
    try {
      setIsSummaryLoading(true);
      setSummaryError('');

      const { data } = await axios.post<GetSummaryResponse>(
        `/api/products/${productId}/reviews/summarize`
      );

      setSummary(data.summary);
    } catch (error) {
      console.log(error);
      setSummaryError('Could not summarize. Please try again.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const {
    data: reviewData,
    error,
    isLoading,
  } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

  if (error) {
    return (
      <div className="text-red-500">
        Could not fetch reviews. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviewData?.reviews.length === 0) {
    return null;
  }

  const currentSummary = reviewData?.summary || summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={handleSummarize}
              disabled={isSummaryLoading}
              className="cursor-pointer"
            >
              <HiSparkles />
              Summarize
            </Button>
            {isSummaryLoading && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewData?.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating rating={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
