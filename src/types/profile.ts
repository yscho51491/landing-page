export type UserPlan = "free" | "paid";

export function parseUserPlan(value: unknown): UserPlan {
  return value === "paid" ? "paid" : "free";
}
