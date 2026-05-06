import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center gap-6 text-white">
      <h1 className="text-3xl font-bold">Infinite Scroll Tutorial</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/basic-infinite-scroll"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition-colors"
        >
          Basic Infinite Scroll
        </Link>
        <Link
          href="/with-virtualization"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold transition-colors"
        >
          With Virtualization
        </Link>
      </div>
    </div>
  );
}
