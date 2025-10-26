
import DownloadContent from "@/components/DownloadContent";
import { Suspense } from "react";

export default function DownloadPage() {
  return (
    <main className="flex-1 p-6 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Download</h1>
        <Suspense fallback={<div>Loading download videos...</div>}>
        <DownloadContent/>
        </Suspense>
      </div>
    </main>
  );
}