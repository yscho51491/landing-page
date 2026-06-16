export type InAppBrowserKind =
  | "kakaotalk"
  | "instagram"
  | "facebook"
  | "line"
  | "other"
  | null;

export function detectInAppBrowser(): InAppBrowserKind {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";

  if (/KAKAOTALK/i.test(ua)) return "kakaotalk";
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV/i.test(ua)) return "facebook";
  if (/Line\//i.test(ua)) return "line";

  if (/Android/i.test(ua) && /wv\)|; wv\)/i.test(ua)) return "other";
  if (/iPhone|iPad|iPod/i.test(ua) && !/Safari/i.test(ua)) return "other";

  return null;
}

export function isInAppBrowser(): boolean {
  return detectInAppBrowser() !== null;
}

/** 카카오톡·인앱 브라우저에서 Safari/Chrome으로 열기 */
export function openInExternalBrowser(url: string): void {
  const kind = detectInAppBrowser();

  if (kind === "kakaotalk") {
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    return;
  }

  if (/Android/i.test(navigator.userAgent)) {
    const withoutProtocol = url.replace(/^https?:\/\//, "");
    window.location.href = `intent://${withoutProtocol}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export function getInAppBrowserLabel(kind: InAppBrowserKind): string {
  switch (kind) {
    case "kakaotalk":
      return "카카오톡";
    case "instagram":
      return "인스타그램";
    case "facebook":
      return "페이스북";
    case "line":
      return "라인";
    default:
      return "앱 내 브라우저";
  }
}
