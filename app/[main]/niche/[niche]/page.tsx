// app/[main]/niche/[niche]/page.tsx
import { notFound } from "next/navigation";

type Creator = {
  channelName: string;
  niche: string;
  subscriberCount: number;
};

type Props = {
  params: { niche: string };
};

export default async function NichePage({ params }: Props) {
  const { niche } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?niche=${encodeURIComponent(niche)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const creators: Creator[] = await res.json();

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        Creators in &quot;{decodeURIComponent(niche)}&quot;
      </h1>

      {creators.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No creators found in this niche.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-5 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {c.channelName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Niche: {c.niche}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Followers: {c.subscriberCount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
