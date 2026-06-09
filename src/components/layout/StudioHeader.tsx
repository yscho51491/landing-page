import HeaderAuth from "@/components/auth/HeaderAuth";
import Image from "next/image";
import Link from "next/link";

export default function StudioHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/studio" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="아트티쳐랩"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="text-lg font-bold text-foreground">수업 만들기</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-emphasis sm:inline"
          >
            랜딩으로
          </Link>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
