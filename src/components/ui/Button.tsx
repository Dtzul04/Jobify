import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
    className?: string;
}

// Primary action bbutton. user for submits like Search; pass classname to tweak layout.
export default function Button({ className, type = "button", children, ...props}: ButtonProps) {
    return (
        <button
            type={type}
            className={`shrink-0 rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-hover disabled:opacity-50 ${className ?? ""}`}
            {...props}
        >
            {children}
        </button>
    )
}