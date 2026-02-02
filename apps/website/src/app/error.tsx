'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-neutral-600 mb-6">
          An error occurred while loading this page. Please try again.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium text-sm"
          >
            Try Again
          </button>
          <a
            href="/"
            className="w-full inline-block bg-gray-200 text-gray-800 px-4 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details
            </summary>
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 overflow-auto">
              <p className="font-bold mb-1">{error.message}</p>
              {error.digest && (
                <p className="text-red-600">Digest: {error.digest}</p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
