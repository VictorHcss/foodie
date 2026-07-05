import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { buildProductFiltersFromSearchParams, listProducts } from "@/services/products.service";
import { paginate, parseNumberParam } from "@/utils/filters";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters = buildProductFiltersFromSearchParams(searchParams);
  const products = listProducts(filters);

  const page = parseNumberParam(searchParams.get("page"));
  const limit = parseNumberParam(searchParams.get("limit"));

  const result = paginate(products, { page, limit });

  return apiSuccess(result);
}
