"use client";

import type { Job } from "@/types";

type CompareViewProps = {
    jobs: Job[];
    onRemove: (job: Job) => void;
};

// Show optional job fields; never confuse missing with empty/zero.
function display(value?: string | null) {
    return value?.trim() ? value : "Not available";
}

const fields: { label: string; value: (job: Job) => string }[] = [
    { label: "Title", value: (job) => display(job.title) },
    { label: "Company", value: (job) => display(job.company) },
    { label: "Location", value: (job) => display(job.location) },
    { label: "Employment type", value: (job) => display(job.employmentType) },
    { label: "Salary", value: (job) => display(job.salaryRange) },
];

// Side-by-side compare of selected jobs; stacks on small screens.
export default function CompareView({ jobs, onRemove }: CompareViewProps) {
    return (
        <section
            aria-label="Job comparison"
            className="mx-6 mb-4 rounded-2xl border border-emerald-200 bg-white/70 p-4 md:p-6"
        >
            <h2 className="mb-4 text-lg font-bold text-text">
                Compare ({jobs.length})
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <article
                        key={job.id}
                        className="flex flex-col gap-3 rounded-lg border border-emerald-200/70 bg-surface p-4"
                    >
                        <dl className="space-y-2 text-sm">
                            {fields.map(({ label, value }) => (
                                <div key={label}>
                                    <dt className="font-medium text-text">{label}</dt>
                                    <dd className="text-text-muted">{value(job)}</dd>
                                </div>
                            ))}
                        </dl>

                        <button
                            type="button"
                            onClick={() => onRemove(job)}
                            className="mt-auto rounded-md bg-surface-muted px-3 py-2 text-sm font-medium text-text hover:bg-emerald-200"
                        >
                            Remove
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
