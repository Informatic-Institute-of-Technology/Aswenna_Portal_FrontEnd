import React from "react";

export type ButtonVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "outline"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

type CommonButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type AnchorButtonProps = CommonButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type AppButtonProps = AnchorButtonProps | NativeButtonProps;

const VARIANT_STYLES: Record<
  ButtonVariant,
  {
    background: string;
    color: string;
    border?: string;
    boxShadow?: string;
  }
> = {
  primary: {
    background:
      "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-primary-hover))",
    color: "var(--text-on-brand)",
    border: "1px solid var(--color-brand-border)",
    boxShadow: "var(--shadow-brand)",
  },
  success: {
    background:
      "linear-gradient(135deg, var(--color-success), var(--color-brand-primary-hover))",
    color: "var(--text-on-brand)",
    border: "1px solid var(--color-success-border, var(--color-brand-border))",
    boxShadow: "var(--shadow-brand)",
  },
  warning: {
    background: "linear-gradient(135deg, var(--color-warning), #d97706)",
    color: "#0f0f0f",
    border: "1px solid var(--color-warning-border)",
    boxShadow: "0 2px 12px rgba(245,158,11,0.3)",
  },
  danger: {
    background: "linear-gradient(135deg, var(--color-error), #b91c1c)",
    color: "#ffffff",
    border: "1px solid var(--color-overdue-border)",
    boxShadow: "var(--shadow-danger)",
  },
  info: {
    background:
      "linear-gradient(135deg, var(--color-info-blue), var(--color-info))",
    color: "#ffffff",
    border: "1px solid var(--color-info-blue-border, rgba(96,165,250,0.3))",
    boxShadow: "0 2px 12px rgba(96,165,250,0.28)",
  },
  neutral: {
    background: "var(--bg-overlay)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-base)",
    boxShadow: "var(--shadow-sm)",
  },
  outline: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--color-brand-border)",
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-subtle)",
    boxShadow: "none",
  },
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3.5 py-2 h-9",
  md: "text-sm px-4 py-2.5 h-10",
  lg: "text-base px-5 py-3 h-12",
};

export function AppButton(props: AppButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    className = "",
    style,
    ...rest
  } = props;

  const variantStyle = VARIANT_STYLES[variant];
  const baseClasses = [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "rounded-[var(--radius-button)]",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-brand-primary)]",
    "hover:brightness-105 hover:-translate-y-[1px]",
    "active:translate-y-[0px] active:brightness-100",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    background: variantStyle.background,
    color: variantStyle.color,
    border: variantStyle.border,
    boxShadow: variantStyle.boxShadow,
    ...style,
  };

  const content = (
    <>
      {leadingIcon && (
        <span className="inline-flex items-center" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="inline-flex items-center gap-1">{children}</span>
      {trailingIcon && (
        <span className="inline-flex items-center" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorButtonProps;
    return (
      <a
        href={href}
        className={baseClasses}
        style={mergedStyle}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeButtonProps;
  return (
    <button
      type={type}
      className={baseClasses}
      style={mergedStyle}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
