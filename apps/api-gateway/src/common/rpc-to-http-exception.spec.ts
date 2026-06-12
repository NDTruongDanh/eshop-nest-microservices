import { HttpException, HttpStatus } from '@nestjs/common';
import { rpcToHttpException } from './rpc-to-http-exception';

type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error: string;
};

describe('rpcToHttpException', () => {
  it('returns existing HTTP exceptions unchanged', () => {
    const exception = new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate product',
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );

    expect(rpcToHttpException(exception)).toBe(exception);
  });

  it('preserves client-facing RPC errors', () => {
    const exception = rpcToHttpException({
      statusCode: 404,
      message: 'Product was not found',
      error: 'Not Found',
    });

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Product was not found',
      error: 'Not Found',
    });
  });

  it('supports nested response payloads and string status codes', () => {
    const exception = rpcToHttpException({
      response: {
        statusCode: '409',
        message: 'SKU already exists',
        error: 'Conflict',
      },
    });

    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'SKU already exists',
      error: 'Conflict',
    });
  });

  it('preserves validation message arrays for 4xx errors', () => {
    const exception = rpcToHttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['name should not be empty', 'price must be positive'],
      error: 'Bad Request',
    });

    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['name should not be empty', 'price must be positive'],
      error: 'Bad Request',
    });
  });

  it('maps RxJS timeout errors to gateway timeout before reading generic messages', () => {
    const exception = rpcToHttpException({
      name: 'TimeoutError',
      message: 'Timeout has occurred',
    });

    expect(exception.getStatus()).toBe(HttpStatus.GATEWAY_TIMEOUT);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.GATEWAY_TIMEOUT,
      message: 'Upstream service timed out',
      error: 'Gateway Timeout',
    });
  });

  it('maps connection failures to bad gateway', () => {
    const exception = rpcToHttpException({
      code: 'ECONNREFUSED',
      message: 'connect ECONNREFUSED 127.0.0.1:3001',
    });

    expect(exception.getStatus()).toBe(HttpStatus.BAD_GATEWAY);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: 'Upstream service unavailable',
      error: 'Bad Gateway',
    });
  });

  it('sanitizes server-side RPC errors', () => {
    const exception = rpcToHttpException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'database password leaked in stack trace',
      error: 'RawSqlError',
    });

    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  });

  it('falls back to internal server error for invalid or unknown payloads', () => {
    const fromInvalidStatus = rpcToHttpException({
      statusCode: 200,
      message: 'OK is not an error',
    }).getResponse() as ErrorResponse;

    const fromUnknownError = rpcToHttpException(
      new Error('unexpected internal detail'),
    ).getResponse() as ErrorResponse;

    expect(fromInvalidStatus).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
    expect(fromUnknownError).toEqual({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  });
});
