import LabIdeaLab from "@/components/lab/LabIdeaLab";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "수업 아이디어 실험실 | 아트티쳐랩",
  description: "새로운 미술 수업 아이디어를 실험하고 발견하는 공간입니다.",
};

export default function LabPage() {
  return (
    <>
      <Header />
      <main className="w-full">
        <LabIdeaLab />
      </main>
    </>
  );
}
