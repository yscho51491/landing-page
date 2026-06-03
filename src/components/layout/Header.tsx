import HeaderAuth from "@/components/auth/HeaderAuth";
import Image from "next/image";
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
        <Link href="#" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="아트티쳐랩 로고"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="text-lg font-bold text-foreground">아트티쳐랩</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-emphasis"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <HeaderAuth />
      </div>
    </header>
  );
}
