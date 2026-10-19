import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "About | Jobify",
    description: "What Jobify does and how it is built",
};

export default function AboutPage() {
    return (
        <main className="flex flex-1 flex-col bg-surface-muted px-4 py-10 md:px-8 md:py-16">
            <div className="mx-auto w-full max-w-3xl space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-600 to-emerald-600 md:text-5xl">
                        About Jobify
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-lg text-text-muted">
                        Search real jobs, filter by type, and get a quick AI summary before you apply.
                    </p>
                </header>

                <Card className="space-y-6 p-6 shadow-md sm:p-8">
                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold text-text">What you can do</h2>
                        <ul className="list-inside list-disc space-y-1 text-text-muted">
                            <li>Search by job title and city</li>
                            <li>Filter by full-time, part-time, contract, or internship</li>
                            <li>Click a job card for a plain-English Gemini summary</li>
                            <li>Use Apply to open the listing in a new tab</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold text-text">How it works</h2>
                        <p className="text-text-muted">
                            Your search goes to Jobify&apos;s API, which calls JSearch for listings. When you
                            click a card, another API route sends the job text to Google Gemini for a short
                            summary. API keys never reach the browser — they stay on the server.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold text-text">Built with</h2>
                        <p className="flex flex-wrap gap-2">
                            {["Next.js", "TypeScript", "Tailwind", "JSearch", "Gemini"].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-emerald-200/80 bg-surface-muted px-3 py-1 text-sm text-text"
                                >
                                    {item}
                                </span>
                            ))}
                        </p>
                    </section>

                    <div className="flex flex-col gap-3 border-t border-emerald-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/"
                            className="inline-flex justify-center rounded-md bg-brand px-5 py-2.5 text-center font-medium text-white hover:bg-brand-hover"
                        >
                            Start searching
                        </Link>
                        <a
                            href="https://github.com/Dtzul04/Jobify/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center text-sm font-medium text-brand hover:text-brand-hover sm:text-right"
                        >
                            Questions? Open a GitHub issue
                        </a>
                    </div>
                </Card>
            </div>
        </main>
    );
}
