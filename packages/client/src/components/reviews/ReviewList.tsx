import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import {
  reviewsApi,
  type GetReviewsResponse,
  type GetSummaryResponse,
} from './reviewsApi';

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const {
    mutate: handleSummarize,
    isPending: isSummaryLoading,
    isError: isSummaryError,
    data: summarizeResponse,
  } = useMutation<GetSummaryResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  const {
    data: reviewData,
    error,
    isLoading,
  } = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
    staleTime: 1000 * 60 * 60 * 24,
  });

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

  const currentSummary = reviewData?.summary || summarizeResponse?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => handleSummarize()}
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
            {isSummaryError && (
              <p className="text-red-500">
                Could not summarize reviews. Please try again.
              </p>
            )}
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
