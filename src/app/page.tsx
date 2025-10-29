import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-linear-to-br from-foreground/80 to-foreground/60 p-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10">
                <Image src="/next.svg" alt="logo" width={28} height={28} className="dark:invert" />
              </div>
            </div>
            <span className="font-semibold">Resume Builder</span>
            <span className="ml-2 rounded-full bg-emerald-100/60 px-2 py-0.5 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Free</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <a className="rounded-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-50" href="#features">Features</a>
            <a className="rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/10" href="#examples">Examples</a>
            <Link className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-95" href="/app/editor">Create resume — it&apos;s free</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Free AI-powered Resume Builder</h1>
            <p className="max-w-xl text-lg text-zinc-700 dark:text-zinc-300">Create a professional, ATS-friendly resume in minutes. Use our AI to tailor content for the job you want — for free. No sign-up required to prototype.</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md hover:shadow-lg" href="/app/editor">Get started — it&apos;s free</Link>
              <a className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm dark:border-white/10" href="#features">See features</a>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6">
                <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path></svg>
                ATS Friendly
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6">
                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                AI-powered suggestions
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4v5h8v-5c0-2.21-1.79-4-4-4z"></path></svg>
                Privacy friendly
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md transform rounded-2xl border border-black/6 bg-[var(--card)] p-6 shadow-lg md:max-w-none">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Jane Doe</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Product Manager — Resume</p>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">PDF • 1 page</div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm text-zinc-700 dark:text-zinc-300">Experienced product manager with a track record of shipping consumer-facing apps. Skilled in product strategy, cross-functional leadership, and data-driven decision making.</p>
                <ul className="mt-2 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>• Led launch of new onboarding flow increasing conversion by 23%</li>
                  <li>• Managed roadmap for 3 core products</li>
                  <li>• Mentored junior PMs and ran quarterly OKR planning</li>
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Generated with AI • ATS-Optimized</div>
                <Link className="rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6" href="/app/editor">Edit</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Truly free',
              desc: 'No paywall. Export PDFs and iterate as much as you like.'
            },
            {
              title: 'AI-powered',
              desc: 'Generate role-specific bullet points and summaries with our built-in AI assistant.'
            },
            {
              title: 'ATS friendly',
              desc: 'We format your resume so applicant tracking systems can read it reliably.'
            }
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-black/6 bg-[var(--card)] p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold">{f.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>

        <section id="examples" className="mt-16">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Examples</h3>
            <Link className="text-sm text-zinc-700 dark:text-zinc-300" href="/app/editor">Create your own</Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-black/6 bg-[var(--card)] p-4 shadow-sm">
                <div className="h-32 rounded bg-zinc-100 dark:bg-white/6" />
                <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Template {i + 1}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-black/6 bg-transparent py-8 dark:border-white/6">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>© {new Date().getFullYear()} Resume Builder — Free & AI-powered</div>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="#">Privacy</a>
              <a className="hover:underline" href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
