export default function Footer() {
  return (
    <footer className="border-t border-border bg-foreground py-10 text-white">
      <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
        <p className="text-lg font-semibold">아트티쳐랩</p>
        <p className="mt-2 text-sm text-gray-300">
          3분 뚝딱 미술 수업 준비 패키지, 아트티쳐랩
        </p>
        <p className="mt-4 text-sm text-gray-400">
          문의:{" "}
          <a
            href="mailto:official@artteacherlab.com"
            className="text-emphasis hover:underline"
          >
            official@artteacherlab.com
          </a>
        </p>
        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} ArtTeacherLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
