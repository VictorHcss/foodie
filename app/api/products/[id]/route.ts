import { NextRequest, NextResponse } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getProductById } from "@/services/products.service";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = getProductById(params.id);

  if (!product) {
    return apiError("Produto não encontrado", 404);
  }

  return apiSuccess(product);
}
