export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          Admin Panel
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Manage your application from the admin panel
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-black dark:text-white mb-2">
              Users
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-black dark:text-white mb-2">
              Posts
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-black dark:text-white mb-2">
              Comments
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
