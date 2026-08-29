export default function CompanyLoading() {
  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading company profile">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="skeleton h-5 w-32 rounded" />
        <div className="glass-panel rounded-2xl p-6"><div className="flex items-center justify-between"><div><div className="skeleton h-7 w-56 rounded" /><div className="skeleton mt-3 h-4 w-72 rounded" /></div><div className="skeleton h-20 w-24 rounded-xl" /></div></div>
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="grid gap-8 lg:grid-cols-2"><div className="space-y-5"><div className="skeleton h-6 w-44 rounded" />{[1, 2, 3, 4].map((item) => <div key={item} className="glass-card rounded-xl p-5"><div className="skeleton h-4 w-40 rounded" /><div className="skeleton mt-3 h-4 w-full rounded" /><div className="skeleton mt-2 h-4 w-4/5 rounded" /></div>)}</div><div className="glass-panel rounded-2xl p-6"><div className="skeleton h-10 w-full rounded-lg" /><div className="skeleton mt-6 h-6 w-48 rounded" /><div className="skeleton mt-4 h-20 w-full rounded" /><div className="skeleton mt-4 h-11 w-full rounded" /></div></div>
      </div>
    </main>
  );
}
