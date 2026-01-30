export default function AppPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          App Dashboard
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Welcome to your application dashboard
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Dashboard Stats
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              View your application statistics and metrics
            </p>
          </div>
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Recent Activity
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Check your recent activities and updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
