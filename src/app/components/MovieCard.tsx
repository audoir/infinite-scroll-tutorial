export const MovieCard = ({
  title,
  description,
  imageURL,
  rating,
}: {
  title: string;
  description: string;
  imageURL: string;
  rating: number;
}) => {
  const imagePath = `https://image.tmdb.org/t/p/w500${imageURL}`;

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={imagePath} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-3">{description}</p>
        <p className="text-sm font-medium text-yellow-400">
          {rating.toFixed(1)}⭐
        </p>
      </div>
    </div>
  );
};
