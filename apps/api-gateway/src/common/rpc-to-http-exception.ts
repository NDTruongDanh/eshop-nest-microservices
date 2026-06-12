import { HttpException, HttpStatus } from '@nestjs/common';

type RpcErrorPayload = {
  status?: unknown;
  statusCode?: unknown;
  message?: unknown;
  error?: unknown;
  response?: unknown;
};

type HttpErrorResponse = {
  statusCode: HttpStatus;
  message: string | string[];
  error: string;
};

const FALLBACK_ERROR_MESSAGE = 'Internal server error';

const FALLBACK_ERROR_RESPONSE: HttpErrorResponse = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: FALLBACK_ERROR_MESSAGE,
  error: 'Internal Server Error',
};

const UPSTREAM_UNAVAILABLE_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'EHOSTUNREACH',
]);

export function rpcToHttpException(error: unknown): HttpException {
  if (error instanceof HttpException) {
    return error;
  }

  const response = normalizeRpcError(error);

  return new HttpException(response, response.statusCode);
}

function normalizeRpcError(error: unknown): HttpErrorResponse {
  if (isTimeoutError(error)) {
    return {
      statusCode: HttpStatus.GATEWAY_TIMEOUT,
      message: 'Upstream service timed out',
      error: 'Gateway Timeout',
    };
  }

  if (isUpstreamUnavailableError(error)) {
    return {
      statusCode: HttpStatus.BAD_GATEWAY,
      message: 'Upstream service unavailable',
      error: 'Bad Gateway',
    };
  }

  const payload = extractRpcErrorPayload(error);
  if (!payload) {
    return FALLBACK_ERROR_RESPONSE;
  }

  const statusCode =
    normalizeHttpErrorStatus(payload.statusCode) ??
    normalizeHttpErrorStatus(payload.status) ??
    FALLBACK_ERROR_RESPONSE.statusCode;

  return {
    statusCode,
    message: resolveMessage(payload.message, statusCode),
    error: resolveErrorTitle(payload.error, statusCode),
  };
}

function extractRpcErrorPayload(error: unknown): RpcErrorPayload | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  if (hasRpcErrorShape(error.response)) {
    return error.response;
  }

  if (hasRpcErrorShape(error.error)) {
    return error.error;
  }

  if (hasRpcErrorShape(error)) {
    return error;
  }

  return undefined;
}

function hasRpcErrorShape(value: unknown): value is RpcErrorPayload {
  return (
    isRecord(value) &&
    ('statusCode' in value ||
      'status' in value ||
      'message' in value ||
      'error' in value)
  );
}

function normalizeHttpErrorStatus(value: unknown): HttpStatus | undefined {
  const statusCodeCandidate =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : undefined;

  if (
    typeof statusCodeCandidate !== 'number' ||
    !Number.isInteger(statusCodeCandidate) ||
    statusCodeCandidate < Number(HttpStatus.BAD_REQUEST) ||
    typeof HttpStatus[statusCodeCandidate] !== 'string'
  ) {
    return undefined;
  }

  return statusCodeCandidate;
}

function resolveMessage(
  message: unknown,
  statusCode: HttpStatus,
): string | string[] {
  if (isServerError(statusCode)) {
    return defaultMessageForStatus(statusCode);
  }

  return normalizeMessage(message) ?? defaultMessageForStatus(statusCode);
}

function normalizeMessage(message: unknown): string | string[] | undefined {
  if (typeof message === 'string') {
    return message.trim() === '' ? undefined : message;
  }

  if (!Array.isArray(message)) {
    return undefined;
  }

  const messages = message.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== '',
  );

  return messages.length > 0 ? messages : undefined;
}

function resolveErrorTitle(error: unknown, statusCode: HttpStatus): string {
  if (isServerError(statusCode)) {
    return defaultTitleForStatus(statusCode);
  }

  return normalizeTitle(error) ?? defaultTitleForStatus(statusCode);
}

function normalizeTitle(error: unknown): string | undefined {
  return typeof error === 'string' && error.trim() !== '' ? error : undefined;
}

function defaultMessageForStatus(statusCode: HttpStatus): string {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'Bad request';
    case HttpStatus.NOT_FOUND:
      return 'Resource not found';
    case HttpStatus.CONFLICT:
      return 'Resource conflict';
    case HttpStatus.BAD_GATEWAY:
      return 'Upstream service unavailable';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'Service unavailable';
    case HttpStatus.GATEWAY_TIMEOUT:
      return 'Upstream service timed out';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return FALLBACK_ERROR_MESSAGE;
    default:
      return defaultTitleForStatus(statusCode);
  }
}

function defaultTitleForStatus(statusCode: HttpStatus): string {
  const statusName = HttpStatus[statusCode];

  if (typeof statusName !== 'string') {
    return 'Error';
  }

  return statusName
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function isTimeoutError(error: unknown): boolean {
  return (
    readStringProperty(error, 'name') === 'TimeoutError' ||
    readStringProperty(error, 'code') === 'ETIMEDOUT' ||
    readStringProperty(error, 'code') === 'ESOCKETTIMEDOUT'
  );
}

function isUpstreamUnavailableError(error: unknown): boolean {
  const code = readStringProperty(error, 'code');

  return code !== undefined && UPSTREAM_UNAVAILABLE_ERROR_CODES.has(code);
}

function readStringProperty(
  value: unknown,
  propertyName: string,
): string | undefined {
  const seen = new Set<unknown>();
  let current = value;

  while (isRecord(current) && !seen.has(current)) {
    seen.add(current);

    const property = current[propertyName];
    if (typeof property === 'string') {
      return property;
    }

    current = current.cause;
  }

  return undefined;
}

function isServerError(statusCode: HttpStatus): boolean {
  return Number(statusCode) >= Number(HttpStatus.INTERNAL_SERVER_ERROR);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
