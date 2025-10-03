import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-subtle hover:bg-accent-soft hover:text-neutral-900 transition-colors",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100/60 transition-colors",
  outline:
    "border border-neutral-300 text-neutral-900 hover:bg-neutral-100/80 transition-colors",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed",
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
);

Button.displayName = "Button";

export default Button;
