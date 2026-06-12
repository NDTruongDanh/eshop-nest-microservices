import {
  BadGatewayException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

type RpcErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export function rpcToHttpException(error: unknown): HttpException {
  const rpcError = normalizeRpcError(error);

  switch (rpcError.statusCode) {
    case 404:
      return new NotFoundException({
        statusCode: 404,
        message: rpcError.message ?? 'Resource not found',
        error: rpcError.error ?? 'Not Found',
      });

    case 502:
      return new BadGatewayException({
        statusCode: 502,
        message: rpcError.message ?? 'Microservice unavailable',
        error: rpcError.error ?? 'Bad Gateway',
      });

    default:
      return new InternalServerErrorException({
        statusCode: 500,
        message: rpcError.message ?? 'Internal server error',
        error: rpcError.error ?? 'Internal Server Error',
      });
  }
}

function normalizeRpcError(error: unknown): RpcErrorPayload {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    return error as RpcErrorPayload;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      statusCode: 500,
      message: String(error.message),
      error: 'Internal Server Error',
    };
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'TimeoutError'
  ) {
    return {
      statusCode: 502,
      message: 'Catalog Service did not respond in time',
      error: 'Bad Gateway',
    };
  }

  return {
    statusCode: 500,
    message: 'Unknown microservice error',
    error: 'Internal Server Error',
  };
}
