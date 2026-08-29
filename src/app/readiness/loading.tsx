export default function ReadinessLoading() {
  return (
    <main className="app-shell min-h-screen px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading readiness review">
      <div className="mx-auto max-w-4xl space-y-8"><div className="skeleton h-5 w-32 rounded" /><div className="space-y-3"><div className="skeleton h-4 w-44 rounded" /><div className="skeleton h-9 w-3/4 rounded-xl" /></div><div className="glass-card rounded-2xl p-8"><div className="skeleton h-5 w-56 rounded" /><div className="skeleton mt-3 h-4 w-full max-w-xl rounded" /><div className="mt-8 grid gap-5 sm:grid-cols-2">{[1, 2, 3, 4, 5].map((item) => <div key={item}><div className="skeleton h-4 w-28 rounded" /><div className="skeleton mt-2 h-11 w-full rounded-lg" /></div>)}</div><div className="skeleton mt-8 h-11 w-32 rounded-lg" /></div></div>
    </main>
  );
}
