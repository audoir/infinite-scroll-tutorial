export const MovieCardSkeleton = () => {
  return (
    <div className="flex animate-pulse">
      <div className="bg-gray-700 rounded w-36 h-48 flex-shrink-0"></div>
      <div className="ml-4 text-left flex-1">
        <div className="bg-gray-700 rounded h-6 w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="bg-gray-700 rounded h-4 w-full"></div>
          <div className="bg-gray-700 rounded h-4 w-full"></div>
          <div className="bg-gray-700 rounded h-4 w-2/3"></div>
        </div>
        <div className="bg-gray-700 rounded h-4 w-16 mt-3"></div>
      </div>
    </div>
  );
};
