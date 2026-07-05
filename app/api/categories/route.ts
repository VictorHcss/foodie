import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";
import { listCategories } from "@/services/categories.service";

export async function GET(request: NextRequest) {
  const categories = listCategories();
  return apiSuccess(categories);
}
