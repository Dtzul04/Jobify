import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
    className?: string;
};

// Text input styled with design tokens. Forwards all native input props (value, onChange, etc.).
export default function Input({ className, type = "text", ...props }: InputProps) {
    return (
        <input
            type={type}
            className={`w-full min-w-0 rounded-md border border-slate-200 bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50 ${className ?? ""}`}
            {...props}
        />
    );
}
