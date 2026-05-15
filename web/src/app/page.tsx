export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
          Adaptive Learning Platform
        </p>
        <h1 className="font-heading text-5xl font-bold sm:text-7xl">NEOT</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Learning should adapt to humans. Humans should not adapt to systems.
        </p>
      </section>
    </main>
  );
}
