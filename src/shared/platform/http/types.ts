import type { AxiosResponse } from 'axios';

// 표준 응답 타입
export interface HttpResponse<T> {
  data: T;
  status: number;
  message: string;
  headers?: Record<string, string>;
  success?: string;
  errorCode?: number;
  errorMessage?: string;
  timestamp?: string;
}

// 요청별 설정
export interface HttpConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  baseURL?: string;
  withCredentials?: boolean;
  paramsSerializer?: (params: Record<string, unknown>) => string;
}

// 표준 오류
export class HttpError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    opts?: { status?: number; code?: string; details?: unknown },
    errorOptions?: ErrorOptions
  ) {
    super(message, errorOptions);
    this.name = 'HttpError';
    if (opts?.status !== undefined) this.status = opts.status;
    if (opts?.code !== undefined) this.code = opts.code;
    if (opts && 'details' in opts) this.details = opts.details;
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

// Axios → 표준 응답 변환
export const toHttpResponse = <T>(res: AxiosResponse<T>): HttpResponse<T> => {
  const out: HttpResponse<T> = {
    data: res.data,
    status: res.status,
    message: res.statusText, // body.message가 있으면 아래에서 덮어씀
  };

  // headers
  if (res.headers !== undefined) {
    out.headers = res.headers as unknown as Record<string, string>;
  }

  // body에 선택 필드가 있으면 안전 추출
  const body = res.data as unknown;
  if (isRecord(body)) {
    if (typeof body.message === 'string') out.message = body.message;
    if (typeof body.success === 'string') out.success = body.success;
    if (typeof body.errorCode === 'number') out.errorCode = body.errorCode;
    if (typeof body.errorMessage === 'string') out.errorMessage = body.errorMessage;
    if (typeof body.timestamp === 'string') out.timestamp = body.timestamp;
  }

  return out;
};
