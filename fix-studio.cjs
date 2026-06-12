const fs = require("fs");
const f = "src/components/studio/LessonResultsPanel.tsx";
let s = fs.readFileSync(f, "utf8");
s = s.replace('import { downloadImagesAsZip } from "@/lib/lesson/download-image-zip";\n', "");
s = s.replace(/  if \(kind === "ppt"\) \{[\s\S]*?\n  \}\n\n  return \(/, "  return (");
s = s.replace(
  "버튼을 누르면 AI가 이미지를 생성합니다. 활동지·예시작품은 각 3장, PPT는\n          슬라이드 10장입니다.",
  "버튼을 누르면 AI가 이미지를 생성합니다. 활동지·예시작품은 각 3장입니다."
);
s = s.replace("lg:grid-cols-3", "lg:grid-cols-2");
fs.writeFileSync(f, s, "utf8");
console.log("ok");
