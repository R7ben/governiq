export default function Loading() {
  return (
    <main className="app-shell min-h-screen px-4 py-10 sm:px-6 sm:py-14" aria-busy="true" aria-label="Loading GovernIQ">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="skeleton h-9 w-36 rounded-lg" />
          <div className="hidden gap-3 sm:flex"><div className="skeleton h-9 w-28 rounded-lg" /><div className="skeleton h-9 w-28 rounded-lg" /></div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5"><div className="skeleton h-6 w-72 rounded-full" /><div className="skeleton h-16 w-full max-w-3xl rounded-xl" /><div className="skeleton h-6 w-full max-w-2xl rounded-lg" /><div className="skeleton h-11 w-44 rounded-lg" /></div>
          <div className="glass-panel rounded-2xl p-6"><div className="skeleton h-4 w-32 rounded" /><div className="skeleton mt-6 h-14 w-40 rounded-lg" /><div className="skeleton mt-4 h-4 w-52 rounded" /><div className="skeleton mt-8 h-16 w-full rounded-lg" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="glass-card rounded-2xl p-6"><div className="skeleton h-10 w-10 rounded-lg" /><div className="skeleton mt-5 h-5 w-40 rounded" /><div className="skeleton mt-3 h-12 w-full rounded" /></div>)}</div>
      </div>
    </main>
  );
}
