import ReferralClaimRunner from "@/components/auth/ReferralClaimRunner";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "아트티쳐랩 | 3분 뚝딱 미술 수업 준비 패키지",
  description:
    "주제와 대상만 입력하면 수업 계획서, 활동지, 도안, 예시작품, 교사대본까지 AI가 한 번에 만들어드립니다. 유치원·초등·미술학원·방과후·공방 선생님을 위한 AI 수업자료 생성 서비스.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ReferralClaimRunner />
      </body>
    </html>
  );
}
