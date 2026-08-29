export default function MethodologyLoading() {
  return (
    <main className="app-shell min-h-screen px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading methodology">
      <div className="mx-auto max-w-4xl space-y-8"><div className="skeleton h-5 w-32 rounded" /><div className="skeleton h-9 w-72 rounded-xl" /><div className="glass-card rounded-2xl p-6"><div className="skeleton h-5 w-full max-w-2xl rounded" /><div className="skeleton mt-3 h-4 w-5/6 rounded" /></div><div className="grid gap-4 sm:grid-cols-2">{[1, 2, 3, 4, 5, 6, 7].map((item) => <div key={item} className="glass-card rounded-2xl p-5"><div className="skeleton h-4 w-12 rounded" /><div className="skeleton mt-3 h-6 w-48 rounded" /><div className="skeleton mt-4 h-12 w-full rounded" /><div className="skeleton mt-4 h-16 w-full rounded" /></div>)}</div></div>
    </main>
  );
}
