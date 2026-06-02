import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "md" | "lg";
  className?: string;
};

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-dark shadow-lg shadow-primary/30",
  secondary:
    "bg-accent text-white hover:bg-violet-700 shadow-lg shadow-accent/25",
  outline:
    "border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground",
};

const sizeStyles = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  href = "#pre-register",
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
