import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { search } from "@/services/search.service";
import { parseNumberParam } from "@/utils/filters";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") ?? "";
  const limit = parseNumberParam(searchParams.get("limit")) ?? 10;
  
  const results = search(query, limit);
  return apiSuccess(results);
}
