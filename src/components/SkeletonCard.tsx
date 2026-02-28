export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
}

