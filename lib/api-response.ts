import { NextResponse } from "next/server";

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  message: string;
}

export function apiSuccess<T>(data: T, init?: number): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status: init ?? 200 });
}

export function apiError(message: string, status = 400): NextResponse<ApiError> {
  return NextResponse.json({ success: false, message }, { status });
}
