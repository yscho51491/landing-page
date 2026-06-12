export async function fetchUserCoins(): Promise<number> {
  const res = await fetch("/api/profile/coins", {
    credentials: "same-origin",
  });

  const data = (await res.json()) as { coins?: number; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "코인 잔액을 불러오지 못했습니다.");
  }

  return typeof data.coins === "number" ? data.coins : 0;
}
