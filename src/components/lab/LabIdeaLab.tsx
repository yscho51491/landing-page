"use client";

import LoginButtons from "@/components/auth/LoginButtons";
import LabDirectionPicker from "@/components/lab/LabDirectionPicker";
import LabIdeaResult from "@/components/lab/LabIdeaResult";
import { RAIL_IMAGES } from "@/components/lab/RailBackground";
import LoadingCanvasOverlay from "@/components/studio/LoadingCanvasOverlay";
import { fetchUserCoins } from "@/lib/coins/fetch-coins";
import { fetchGenerateIdea } from "@/lib/lab/fetch-generate-idea";
import { fetchProposeDirections } from "@/lib/lab/fetch-propose-directions";
import type { LabLessonDirection, LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PLACEHOLDER_WORDS = [
  "우주",
  "별자리",
  "별",
  "달",
  "밤하늘",
  "구름",
  "비",
  "무지개",
  "햇님",
  "공룡",
  "화석",
  "화산",
  "외계인",
  "행성",
  "오로라",
  "바다",
  "물고기",
  "해파리",
  "파도",
  "서핑",
  "수영장",
  "비치타올",
  "수산시장",
  "앵무새",
  "북극곰",
  "캥거루",
  "토끼",
  "코끼리",
  "달팽이",
  "애벌레",
  "거미",
  "반딧불이",
  "나비",
  "동물무늬",
  "나무",
  "단풍",
  "꽃",
  "매화",
  "장미",
  "카네이션",
  "바구니",
  "식물원",
  "채소",
  "과일",
  "디저트",
  "케이크",
  "햄버거",
  "초밥",
  "떡국",
  "붕어빵",
  "과자",
  "스무디",
  "이탈리아식탁",
  "접시",
  "크리스마스",
  "트리",
  "오르골",
  "리스",
  "마을",
  "호박",
  "도깨비",
  "복주머니",
  "어버이날",
  "가족",
  "엄마",
  "장바구니",
  "병원",
  "스키장",
  "아이스링크",
  "서커스",
  "회전목마",
  "해적선",
  "보물지도",
  "랜드마크",
  "빌딩",
  "건물",
  "섬",
  "알라딘",
  "방",
  "침대",
  "책장",
  "옷장",
  "문",
  "터널",
  "열쇠구멍",
  "거울",
  "자판기",
  "게임화면",
  "픽셀아트",
  "캐릭터",
  "히어로",
  "영화포스터",
  "광고",
  "타이포그라피",
  "이니셜",
  "자화상",
  "얼굴",
  "표정",
  "감정",
  "희노애락",
  "그림자",
  "폴라로이드",
  "액자",
  "책표지",
  "포스터",
  "인형",
  "스웨터",
  "운동화",
  "신발",
  "헤어스타일",
  "뒷모습",
  "선글라스",
  "걷는사람",
  "친구",
  "옵아트",
  "산수화",
  "청자",
  "이집트벽화",
  "스테인드글라스",
  "콜라주",
  "데칼코마니",
  "마블링",
  "스텐실",
  "판화",
  "도트",
  "패턴",
  "두들",
  "폴리곤",
  "백드롭페인팅",
  "펜화",
  "소묘",
  "수채화",
  "추상화",
];

const PLACEHOLDER_OFFSET_2 = Math.floor(PLACEHOLDER_WORDS.length / 2);

const HEADLINE_WORDS = ["즐거운", "감동하는", "잊지못할", "유익한"];

const TYPE_MS = 160;
const DELETE_MS = 80;
const HOLD_MS = 1400;

type LoadingMode = "directions" | "idea" | null;

function useTypewriterPlaceholder(wordOffset: number): string {
  const [text, setText] = useState("");
  const stateRef = useRef({
    wordIndex: wordOffset % PLACEHOLDER_WORDS.length,
    charCount: 0,
    deleting: false,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const s = stateRef.current;
      const word = PLACEHOLDER_WORDS[s.wordIndex];

      if (!s.deleting) {
        s.charCount += 1;
        setText(word.slice(0, s.charCount));
        if (s.charCount >= word.length) {
          s.deleting = true;
          timer = setTimeout(tick, HOLD_MS);
          return;
        }
        timer = setTimeout(tick, TYPE_MS);
        return;
      }

      s.charCount -= 1;
      setText(word.slice(0, s.charCount));
      if (s.charCount <= 0) {
        s.deleting = false;
        s.wordIndex = (s.wordIndex + 1) % PLACEHOLDER_WORDS.length;
      }
      timer = setTimeout(tick, DELETE_MS);
    };

    timer = setTimeout(tick, TYPE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return text;
}

function HeadlineWordRotator() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "exiting" | "entering">(
    "visible",
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase("exiting");
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "exiting") {
      const timer = setTimeout(() => {
        setIndex((i) => (i + 1) % HEADLINE_WORDS.length);
        setPhase("entering");
      }, 450);
      return () => clearTimeout(timer);
    }
    if (phase === "entering") {
      const timer = setTimeout(() => setPhase("visible"), 550);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const animClass =
    phase === "exiting"
      ? "lab-word-exit"
      : phase === "entering"
        ? "lab-word-enter"
        : "";

  return (
    <span
      className={`inline-block w-[4.4em] text-center align-bottom text-emphasis ${animClass}`}
    >
      {HEADLINE_WORDS[index]}
    </span>
  );
}

function ImageMarquee({
  direction,
  tall = false,
}: {
  direction: "left" | "right";
  tall?: boolean;
}) {
  const looped = [...RAIL_IMAGES, ...RAIL_IMAGES];

  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === "left" ? "lab-marquee-left" : "lab-marquee-right"
        }`}
      >
        {looped.map((src, i) => (
          <div
            key={i}
            className={`shrink-0 overflow-hidden rounded-xl ${
              tall ? "h-72 md:h-96" : "h-60 md:h-72"
            }`}
          >
            <Image
              src={src}
              alt=""
              aria-hidden
              width={0}
              height={0}
              sizes="33vw"
              unoptimized
              className="h-full w-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function randomWord(exclude?: string): string {
  const pool = PLACEHOLDER_WORDS.filter((w) => w !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function isLoginRequiredMessage(message: string): boolean {
  return message.includes("로그인");
}

export default function LabIdeaLab() {
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loadingMode, setLoadingMode] = useState<LoadingMode>(null);
  const [pendingWords, setPendingWords] = useState<[string, string] | null>(null);
  const [directions, setDirections] = useState<LabLessonDirection[] | null>(null);
  const [selectedDirection, setSelectedDirection] =
    useState<LabLessonDirection | null>(null);
  const [result, setResult] = useState<LabLessonIdea | null>(null);
  const [resultWords, setResultWords] = useState<[string, string]>(["", ""]);
  const [lessonId, setLessonId] = useState<string | undefined>();
  const [coins, setCoins] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const placeholder1 = useTypewriterPlaceholder(0);
  const placeholder2 = useTypewriterPlaceholder(PLACEHOLDER_OFFSET_2);

  const bothFilled = word1.trim().length > 0 && word2.trim().length > 0;
  const isBusy = loadingMode !== null;

  useEffect(() => {
    void fetchUserCoins()
      .then(setCoins)
      .catch(() => setCoins(0));
  }, []);

  const proposeDirections = async (w1: string, w2: string) => {
    setLoadingMode("directions");
    setNotice(null);
    setDirections(null);
    setSelectedDirection(null);
    setResult(null);
    setLessonId(undefined);
    setPendingWords([w1, w2]);

    try {
      const next = await fetchProposeDirections(w1, w2);
      setDirections(next);
    } catch (err) {
      setPendingWords(null);
      const message =
        err instanceof Error ? err.message : "수업 방향 제안에 실패했습니다.";
      if (isLoginRequiredMessage(message)) {
        setShowLoginModal(true);
        setNotice(null);
      } else {
        setNotice(message);
      }
    } finally {
      setLoadingMode(null);
    }
  };

  const generateFromDirection = async (
    w1: string,
    w2: string,
    direction: LabLessonDirection,
  ) => {
    setLoadingMode("idea");
    setNotice(null);
    setSelectedDirection(direction);

    try {
      const { idea, lessonId: savedId } = await fetchGenerateIdea(w1, w2, direction);
      setResult(idea);
      setResultWords([w1, w2]);
      setLessonId(savedId);
      setDirections(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "아이디어 생성에 실패했습니다.";
      if (isLoginRequiredMessage(message)) {
        setShowLoginModal(true);
        setNotice(null);
      } else {
        setNotice(message);
      }
    } finally {
      setLoadingMode(null);
    }
  };

  const handlePropose = () => {
    if (isBusy) return;
    if (!bothFilled) {
      setNotice("아이디어를 입력해주세요.");
      return;
    }
    void proposeDirections(word1.trim(), word2.trim());
  };

  const handleRandom = () => {
    if (isBusy) return;
    const w1 = word1.trim() || randomWord();
    const w2 = word2.trim() || randomWord(w1);
    setWord1(w1);
    setWord2(w2);
    void proposeDirections(w1, w2);
  };

  const handleDirectionSelect = (direction: LabLessonDirection) => {
    if (!pendingWords || isBusy) return;
    void generateFromDirection(pendingWords[0], pendingWords[1], direction);
  };

  const handleBackToInput = () => {
    if (isBusy) return;
    setDirections(null);
    setPendingWords(null);
    setSelectedDirection(null);
    setNotice(null);
  };

  const handleReset = () => {
    setResult(null);
    setLessonId(undefined);
    setDirections(null);
    setPendingWords(null);
    setSelectedDirection(null);
    setNotice(null);
    setWord1("");
    setWord2("");
  };

  useEffect(() => {
    if (!result && !directions) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [result, directions]);

  const loginModal =
    showLoginModal &&
    createPortal(
      <div
        className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-login-modal-title"
      >
        <div
          className="w-full max-w-md rounded-3xl bg-surface p-8 text-center shadow-2xl md:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowLoginModal(false)}
            aria-label="닫기"
            className="float-right flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-emphasis hover:text-emphasis"
          >
            ✕
          </button>
          <h2
            id="lab-login-modal-title"
            className="mt-2 text-xl font-bold text-foreground"
          >
            로그인하고 수업 아이디어를 만들어 보세요
          </h2>
          <p className="mt-2 text-sm text-muted">
            Google 또는 카카오로 로그인하면 AI 수업 기획을 시작할 수 있어요.
          </p>
          <div className="mt-7 flex justify-center">
            <LoginButtons redirectPath="/lab" />
          </div>
        </div>
      </div>,
      document.body,
    );

  const directionModal =
    directions &&
    pendingWords &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-16 backdrop-blur-sm md:p-8 md:pt-20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-direction-picker-title"
      >
        <div
          className="mb-8 w-full max-w-2xl rounded-3xl bg-surface p-7 shadow-2xl md:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleBackToInput}
            disabled={isBusy}
            aria-label="닫기"
            className="float-right flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-emphasis hover:text-emphasis disabled:opacity-50"
          >
            ✕
          </button>
          <div id="lab-direction-picker-title">
            <LabDirectionPicker
              words={pendingWords}
              directions={directions}
              onSelect={handleDirectionSelect}
              onBack={handleBackToInput}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>,
      document.body,
    );

  const resultModal =
    result &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-20 backdrop-blur-sm md:p-8"
        onClick={handleReset}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-idea-result-title"
      >
        <div
          className="mb-8 w-full max-w-2xl rounded-3xl bg-surface p-7 shadow-2xl md:p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleReset}
            aria-label="닫기"
            className="float-right flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-emphasis hover:text-emphasis"
          >
            ✕
          </button>
          <LabIdeaResult
            idea={result}
            words={resultWords}
            direction={selectedDirection ?? undefined}
            lessonId={lessonId}
            coins={coins}
            onCoinsChange={setCoins}
            onReset={handleReset}
          />
        </div>
      </div>,
      document.body,
    );

  const loadingOverlay =
    loadingMode &&
    createPortal(
      <LoadingCanvasOverlay
        message={
          loadingMode === "directions"
            ? "수업 방향을 찾고 있어요..."
            : "수업 기획안을 만들고 있어요..."
        }
        submessage="잠시만 기다려 주세요."
        className="fixed inset-0 z-[210] flex items-center justify-center bg-black/45 px-5 backdrop-blur-[2px]"
      />,
      document.body,
    );

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {loginModal}
      {directionModal}
      {resultModal}
      {loadingOverlay}
      <div className="flex min-h-[calc(100dvh-4.25rem)] flex-col">
        <div className="relative z-10 shrink-0 px-5 pt-10 pb-6 text-center md:pt-14 md:pb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            참여자가 <HeadlineWordRotator /> 수업
          </h1>
          <p className="mt-5 text-base text-muted md:text-lg">
            두 단어로 수업을 기획하세요.
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col justify-end pb-8 md:pb-12">
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <ImageMarquee direction="left" tall />
          </div>

          <div className="relative z-10 mx-auto w-full px-5">
            <div className="mx-auto w-full max-w-3xl rounded-3xl border border-primary/25 bg-surface/97 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md md:p-12">
              <p className="text-center text-4xl" aria-hidden>
                💡
              </p>
              <p className="mt-3 text-center text-base leading-relaxed text-muted md:text-lg md:leading-8">
                놀라운 수업 아이디어를 아주 작은 발상의 전환으로
                <br />
                만들어볼 수 있습니다.
                <br />
                <br />
                지금 바로 2가지 단어를 작성해보세요.
                <br />
                AI가 3가지 수업 방향을 제안해 드려요.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <input
                  type="text"
                  value={word1}
                  onChange={(e) => {
                    setWord1(e.target.value.slice(0, 10));
                    setNotice(null);
                  }}
                  maxLength={10}
                  disabled={isBusy}
                  placeholder={placeholder1}
                  aria-label="첫 번째 단어"
                  className="w-full rounded-xl border border-border bg-background px-5 py-4 text-center text-lg font-semibold text-foreground outline-none ring-emphasis/30 transition-shadow placeholder:font-normal placeholder:text-gray-300 focus:ring-2 sm:w-56"
                />
                <input
                  type="text"
                  value={word2}
                  onChange={(e) => {
                    setWord2(e.target.value.slice(0, 10));
                    setNotice(null);
                  }}
                  maxLength={10}
                  disabled={isBusy}
                  placeholder={placeholder2}
                  aria-label="두 번째 단어"
                  className="w-full rounded-xl border border-border bg-background px-5 py-4 text-center text-lg font-semibold text-foreground outline-none ring-emphasis/30 transition-shadow placeholder:font-normal placeholder:text-gray-300 focus:ring-2 sm:w-56"
                />
              </div>

              {notice && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                  {notice}
                </p>
              )}

              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePropose}
                  disabled={!bothFilled || isBusy}
                  className={`rounded-full px-9 py-4 text-base font-bold transition-all ${
                    bothFilled && !isBusy
                      ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                      : "cursor-not-allowed bg-border text-muted"
                  }`}
                >
                  수업 방향 보기
                </button>
                <button
                  type="button"
                  onClick={handleRandom}
                  disabled={isBusy}
                  className="rounded-full border-2 border-primary bg-surface px-9 py-4 text-base font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBusy ? "잠시만요..." : "랜덤 생성"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface-alt/40 pt-20 pb-24">
        <div className="px-5 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
            고민없이 아이디어를 얻어보세요.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
            2000명 수업 노하우를 아낌없이 담아
            <br />
            액기스만 생성되는 커리큘럼
          </p>
        </div>

        <div className="mt-12">
          <ImageMarquee direction="right" />
        </div>
      </div>
    </section>
  );
}
