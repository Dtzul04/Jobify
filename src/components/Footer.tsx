import Link from "next/link";

// Site-wide footer; wired in root layout.tsx
export default function Footer() {
    return(
        <footer className="mt-auto border-t border-emerald-200/80 bg-surface px-4 py-6 text-center text-sm text-text-muted md:px-8">
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <Link href="/" className="hover:text-brand">
                    Home
                </Link>
                <Link href="/about" className="hover:text-brand">
                    About
                </Link>
                <a 
                    href="https://github.com/Dtzul04/Jobify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand"
                >
                    GitHub
                </a>
            </nav>
            <p className="mt-3">Jobify - search jobs with plain English summaries</p>
        </footer>
    )
}