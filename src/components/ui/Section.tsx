type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
};

export default function Section({
  id,
  children,
  className = "",
  alt = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${alt ? "bg-surface-alt" : "bg-background"} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  emoji?: string;
};

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  emoji,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {emoji && (
        <span className="mb-3 inline-block text-4xl" aria-hidden>
          {emoji}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-snug text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
