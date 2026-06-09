"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StudioCtaButtonProps = {
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

export default function StudioCtaButton({
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: StudioCtaButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      router.push(user ? "/studio" : "/login?next=/studio");
    } catch {
      router.push("/login?next=/studio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-70 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? "이동 중..." : children}
    </button>
  );
}
