import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & {
    className?: string;
};

// Surface container (white box + shadow). Use for SearchBar wrapper, job tiles, etc.
export default function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={`rounded-lg bg-surface p-3 shadow-sm sm:p-4 ${className ?? ""}`}
            {...props}
        >
            {children}
        </div>
    );
}
