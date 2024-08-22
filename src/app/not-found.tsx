"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-center ">
        <h1 className="text-6xl font-bold text-neutral">404</h1>
        <h2 className="text-lg font-semibold text-zinc-500">Page Not Found</h2>
        <p className="mt-4 text-zinc-500 text-sm mx-20 md:mx-auto">
          The page your looking for does not exist or has been moved.
        </p>
        <div className="flex  gap-3 flex-col mt-10">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-xs text-white rounded hover:bg-neutral"
          >
            Homepage
          </Link>

          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-primary text-xs text-white rounded hover:bg-neutral"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
