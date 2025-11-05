/**
 * Loading Skeleton for Campus Life Page
 */

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="h-[60vh] min-h-[400px] bg-gray-200 animate-pulse" />

      {/* Sections Skeleton */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-300 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

