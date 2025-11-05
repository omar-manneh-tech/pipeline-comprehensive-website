/**
 * Blog Loading Skeleton
 */

export default function BlogLoading() {
  return (
    <>
      {/* Hero Banner Skeleton */}
      <section className="relative h-[300px] md:h-[400px] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search Skeleton */}
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="h-14 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Category Filter Skeleton */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>

            {/* Blog Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="flex gap-4 mt-4">
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

