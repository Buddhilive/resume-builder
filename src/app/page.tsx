import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 overflow-y-auto">
      <header className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md p-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm">
                <Image src="/RESUME-BUILDER-LOGO.png" alt="logo" width={28} height={28} className="dark:invert" />
              </div>
            </div>
            <span className="font-semibold">Resume Builder</span>
            <span className="ml-2 rounded-full bg-emerald-100/60 px-2 py-0.5 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Free</span>
            <span className="ml-2 rounded-full bg-slate-100/60 px-2 py-0.5 text-sm font-medium text-slate-800 dark:bg-slate-900/40 dark:text-slate-300">Beta</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <a className="rounded-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-50" href="#features">Features</a>
            <Link className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-95" href="/app/editor/resume">Create resume</Link>
            <Link className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-95" href="/app/editor/cover-letter">Create cover letter</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Free AI-powered Resume & Cover Letter Builder</h1>
            <p className="max-w-xl text-lg text-zinc-700 dark:text-zinc-300">Create professional, ATS-friendly resumes and compelling cover letters in minutes. Use our AI to tailor content, translate documents, and generate personalized cover letters for any job — all for free. No sign-up required to prototype.</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-md hover:shadow-lg" href="/app/editor/resume">Get started — it&apos;s free</Link>
              <Link className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm dark:border-white/10" href="/app/cover-letters">Create cover letter</Link>
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
                <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                AI Translation
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4v5h8v-5c0-2.21-1.79-4-4-4z"></path></svg>
                Privacy friendly
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md transform rounded-2xl border border-black/6 bg-[--card] p-6 shadow-lg md:max-w-none">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Jane Doe</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Product Manager — Resume & Cover Letter</p>
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
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Generated with AI • ATS-Optimized • Multi-language</div>
                <Link className="rounded-md bg-zinc-100/80 px-3 py-1 text-sm dark:bg-white/6" href="/app/editor/resume">Edit</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              title: 'Truly free',
              desc: 'No paywall. Export PDFs and iterate as much as you like.'
            },
            {
              title: 'AI-powered',
              desc: 'Generate role-specific bullet points, summaries, and complete cover letters with our built-in AI assistant.'
            },
            {
              title: 'ATS friendly',
              desc: 'We format your resume so applicant tracking systems can read it reliably.'
            },
            {
              title: 'AI Translation',
              desc: 'Translate your resumes and cover letters to any language while maintaining professional formatting.'
            }
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-black/6 bg-[--card] p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold">{f.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="mt-20 border-t border-black/6 bg-transparent py-8 dark:border-white/6">
        <div className="mx-auto max-w-6xl px-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>© {new Date().getFullYear()} Resume Builder — Free AI-powered resumes & cover letters</div>
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
