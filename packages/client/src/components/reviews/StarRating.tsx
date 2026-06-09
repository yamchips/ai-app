import { FaRegStar, FaStar } from 'react-icons/fa6';

type Props = {
  rating: number;
};

const StarRating = ({ rating }: Props) => {
  const placeholder = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1 text-yellow-500">
      {placeholder.map((p) =>
        p <= rating ? <FaStar key={p} /> : <FaRegStar key={p} />
      )}
    </div>
  );
};

export default StarRating;
