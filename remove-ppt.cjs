const fs = require("fs");
const path = require("path");
const root = __dirname;

function patch(rel, fn) {
  const file = path.join(root, rel);
  const before = fs.readFileSync(file, "utf8");
  const after = fn(before);
  if (before !== after) {
    fs.writeFileSync(file, after, "utf8");
    console.log("ok", rel);
  } else {
    console.log("skip", rel);
  }
}

const simple = {
  "src/components/sections/HeroSection.tsx": [
    ['  { emoji: "\uD83D\uDCCA", label: "PPT" },\n', ""],
  ],
  "src/components/sections/FinalCTASection.tsx": [
    ["PPT, \uad50\uc0ac\ub300\ubcf8\uae4c\uc9c0", "\uad50\uc0ac\ub300\ubcf8\uae4c\uc9c0"],
  ],
  "src/components/sections/ProblemSection.tsx": [
    ['  { emoji: "\uD83D\uDCCA", text: "PPT \uc81c\uc791" },\n', ""],
  ],
  "src/components/sections/InputExampleSection.tsx": [
    ["\uc608\uc2dc\uc791\ud488, PPT, \uad50\uc0ac \ub300\ubcf8", "\uc608\uc2dc\uc791\ud488, \uad50\uc0ac \ub300\ubcf8"],
  ],
  "src/components/sections/ComparisonSection.tsx": [
    ["\uacc4\ud68d\uc11c, \ub3c4\uc548, PPT\ub97c \ub530\ub85c \uc81c\uc791", "\uacc4\ud68d\uc11c, \ub3c4\uc548\uc744 \ub530\ub85c \uc81c\uc791"],
    ["\uacc4\ud68d\uc11c, \ub3c4\uc548, PPT, \ub300\ubcf8\uae4c\uc9c0 \ud55c \ubc88\uc5d0 \uc81c\uacf5", "\uacc4\ud68d\uc11c, \ub3c4\uc548, \ub300\ubcf8\uae4c\uc9c0 \ud55c \ubc88\uc5d0 \uc81c\uacf5"],
  ],
  "src/components/sections/BenefitsSection.tsx": [
    ["\uc608\uc2dc\uc791\ud488, PPT, \uad50\uc0ac\ub300\ubcf8", "\uc608\uc2dc\uc791\ud488, \uad50\uc0ac\ub300\ubcf8"],
  ],
  "src/components/sections/HowToUseSection.tsx": [
    ["PPT, \ud65c\ub3d9\uc9c0, \ub3c4\uc548, \uad50\uc0ac\ub300\ubcf8", "\ud65c\ub3d9\uc9c0, \ub3c4\uc548, \uad50\uc0ac\ub300\ubcf8"],
  ],
  "src/components/sections/GenerationExampleSection.tsx": [
    ['  "\uc218\uc5c5\uc6a9 PPT",\n', ""],
  ],
  "src/app/layout.tsx": [
    ["\uc608\uc2dc\uc791\ud488, PPT, \uad50\uc0ac\ub300\ubcf8", "\uc608\uc2dc\uc791\ud488, \uad50\uc0ac\ub300\ubcf8"],
  ],
};

for (const [rel, pairs] of Object.entries(simple)) {
  patch(rel, (s) => {
    for (const [a, b] of pairs) s = s.split(a).join(b);
    return s;
  });
}

patch("src/components/sections/ServiceIntroDemo.tsx", (s) =>
  s.replace(/\s*\{\s*label: "PPT",[\s\S]*?fit: "cover-top",\s*\},\s*/, "\n")
);

patch("src/components/sections/FAQSection.tsx", (s) =>
  s.replace(/\s*\{\s*question: "PPT\ub3c4 \ud568\uaed8 \uc81c\uacf5\ub418\ub098\?",[\s\S]*?\},\s*/, "\n")
);

patch("src/components/sections/DeliverablesSection.tsx", (s) =>
  s
    .replace(/\s*\{\s*number: "4",\s*title: "\uc218\uc5c5\uc6a9 PPT",[\s\S]*?\},\s*/, "\n")
    .replace('number: "5",\n    title: "\uad50\uc0ac\ub300\ubcf8"', 'number: "4",\n    title: "\uad50\uc0ac\ub300\ubcf8"')
);

patch("src/components/sections/ExampleImageGallery.tsx", (s) =>
  s
    .replace(/\s*unoptimized=\{item\.id === "ppt"\}\n/, "\n")
    .replace(/\s*unoptimized=\{activeItem\.id === "ppt"\}\n/, "\n")
);

console.log("done");
