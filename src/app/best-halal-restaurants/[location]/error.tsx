"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2 className="mb-[1rem]">Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
