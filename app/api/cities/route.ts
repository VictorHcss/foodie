import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { listCities } from "@/services/cities.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") ?? undefined;
  
  const cities = listCities(search);
  return apiSuccess(cities);
}
