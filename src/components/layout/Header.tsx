import Link from "next/link";

const navItems = [
  { label: "서비스 소개", href: "#service" },
  { label: "제공 자료", href: "#deliverables" },
  { label: "사용 방법", href: "#how-to-use" },
  { label: "후기", href: "#trust" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="#" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            AT
          </span>
          <span className="text-lg font-bold text-foreground">아트티쳐랩</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#pre-register"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark md:px-5 md:py-2.5"
        >
          무료 체험 신청
        </Link>
      </div>
    </header>
  );
}
