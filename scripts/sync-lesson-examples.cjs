const fs = require("fs");

const meta = {
  "내가 만드는 별자리.png": { id: "constellation", title: "내가 만드는 별자리", alt: "내가 만드는 별자리 수업 완성작", aspect: "4:5" },
  "라인클레이아트.png": { id: "line-clay-art", title: "라인클레이아트", alt: "라인클레이아트 수업 완성작", aspect: "9:16" },
  "sample-work.png": { id: "sample-work", title: "수업 완성작", alt: "수업 완성작 예시", aspect: "4:5" },
  "parent-class-sample-1.png": { id: "parent-class-sample-1", title: "우리 가족 꽃액자", alt: "부모참여 수업 꽃액자 예시", aspect: "9:16" },
  "parent-class-sample-2.png": { id: "parent-class-sample-2", title: "가족 감사 카드", alt: "부모참여 수업 활동지 예시", aspect: "4:5" },
  "parent-class-design-1.png": { id: "parent-class-design-1", title: "꽃액자 도안", alt: "꽃액자 도안 예시", aspect: "9:16" },
  "parent-class-design-2.png": { id: "parent-class-design-2", title: "꽃액자 디자인", alt: "꽃액자 디자인 예시", aspect: "4:5" },
  "summer-demo-sample-1.png": { id: "summer-demo-sample-1", title: "여름 수박 푸드아트", alt: "여름 수박 푸드아트 예시", aspect: "9:16" },
  "양초 없이 바틱수업 (1).png": { id: "batik-no-wax-1", title: "양초를 쓰지 않고 만드는 '바틱' 수업", alt: "노왁스 바틱 기법 수업 완성작", aspect: "4:5" },
  "양초 없이 바틱수업 (2).png": { id: "batik-no-wax-2", title: "양초를 쓰지 않고 만드는 '바틱' 수업", alt: "노왁스 바틱 기법 수업 완성작", aspect: "4:5" },
  "삐리리리- 로봇을 본 적 있나요.jpg": { id: "robot-collage", title: "삐리리리- 로봇을 본 적 있나요?", alt: "재활용 재료 로봇 콜라주 수업 완성작", aspect: "4:5" },
  "컬러풀 해파리.png": { id: "colorful-jellyfish", title: "컬러풀 해파리", alt: "종이 접시 해파리 조형 수업 완성작", aspect: "4:5" },
};

const files = fs.readdirSync("public/images/explore").filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, "ko"));
let shotIdx = 0;
const items = files.map((file, i) => {
  if (meta[file]) {
    const m = meta[file];
    return { id: m.id, imageSrc: "/images/explore/" + file, imageAlt: m.alt, title: m.title, aspect: m.aspect };
  }
  const aspect = i % 2 === 0 ? "4:5" : "9:16";
  const base = file.replace(/\.[^.]+$/, "");
  const stamp = file.match(/(\d{4}-\d{2}-\d{2} \d+)/);
  const isScreenshot = base.startsWith("스크린샷");
  const id = stamp
    ? "shot-" + stamp[1].replace(/[\s:]/g, "-")
    : (base.replace(/\s+/g, "-").replace(/[^\w\uAC00-\uD7A3-]/g, "").toLowerCase() || "img-" + (++shotIdx));
  const title = isScreenshot ? "수업 완성작 예시" : base;
  return { id, imageSrc: "/images/explore/" + file, imageAlt: title + " 수업 완성작", title, aspect };
});

const lines = items.map((it) => "  {\n    id: " + JSON.stringify(it.id) + ",\n    imageSrc: " + JSON.stringify(it.imageSrc) + ",\n    imageAlt: " + JSON.stringify(it.imageAlt) + ",\n    title: " + JSON.stringify(it.title) + ",\n    aspect: " + JSON.stringify(it.aspect) + ",\n  }");

const header = [
  'export type LessonExampleAspect = "4:5" | "9:16" | "2:3";',
  "",
  "export type LessonExample = {",
  "  id: string;",
  "  imageSrc: string;",
  "  imageAlt: string;",
  "  title: string;",
  "  aspect: LessonExampleAspect;",
  "};",
  "",
  "/** public/images/explore/ 폴더 이미지 " + items.length + "개 */",
  "export const lessonExamples: LessonExample[] = [",
].join("\n");

const footer = [
  "];",
  "",
  "const aspectClassMap: Record<LessonExampleAspect, string> = {",
  '  "4:5": "aspect-[4/5]",',
  '  "9:16": "aspect-[9/16]",',
  '  "2:3": "aspect-[2/3]",',
  "};",
  "",
  "export function getLessonExampleAspectClass(aspect: LessonExampleAspect): string {",
  "  return aspectClassMap[aspect];",
  "}",
  "",
  "/** 파일명 공백·한글 URL 인코딩 (외부 URL은 그대로 사용) */",
  "export function getLessonExampleImageSrc(src: string): string {",
  '  if (src.startsWith("http://") || src.startsWith("https://")) {',
  "    return src;",
  "  }",
  '  const slash = src.lastIndexOf("/");',
  "  if (slash === -1) {",
  "    return encodeURI(src);",
  "  }",
  "  return src.slice(0, slash + 1) + encodeURIComponent(src.slice(slash + 1));",
  "}",
  "",
].join("\n");

fs.writeFileSync("src/data/lessonExamples.ts", header + "\n" + lines.join(",\n") + ",\n" + footer, "utf8");
console.log("lessonExamples.ts:", items.length);

let grid = fs.readFileSync("src/components/explore/LessonExploreGrid.tsx", "utf8");
grid = grid.replace(
  "  getLessonExampleAspectClass,\n  lessonExamples,",
  "  getLessonExampleAspectClass,\n  getLessonExampleImageSrc,\n  lessonExamples,"
);
grid = grid.replace(
  "                src={item.imageSrc}\n                alt={item.imageAlt}\n                fill\n                className=",
  "                src={getLessonExampleImageSrc(item.imageSrc)}\n                alt={item.imageAlt}\n                fill\n                unoptimized\n                className="
);
fs.writeFileSync("src/components/explore/LessonExploreGrid.tsx", grid, "utf8");
console.log("LessonExploreGrid.tsx updated");
