import { handleGetCoinsGet } from "@/lib/coins/handle-get-coins";

export const runtime = "nodejs";

export async function GET() {
  return handleGetCoinsGet();
}
