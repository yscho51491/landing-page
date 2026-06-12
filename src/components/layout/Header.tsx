import HeaderAuth from "@/components/auth/HeaderAuth";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "완성작 구경", mobileLabel: "홈", href: "/" },
  { label: "수업 아이디어 실험실", mobileLabel: "랩", href: "/lab" },
  { label: "서비스 소개", mobileLabel: "소개", href: "/service" },
  { label: "수업 만들기", href: "/studio", hideOnMobile: true },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-3 py-3 md:px-5">
        <Link href="/" className="flex items-center gap-2.5">
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

        <nav className="flex items-center gap-0.5 md:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2 py-2 text-sm font-medium text-muted transition-colors hover:bg-primary hover:text-primary-foreground md:px-3 ${
                item.hideOnMobile ? "hidden md:inline-flex" : ""
              }`}
            >
              {item.mobileLabel ? (
                <>
                  <span className="md:hidden">{item.mobileLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>

        <HeaderAuth />
      </div>
    </header>
  );
}
