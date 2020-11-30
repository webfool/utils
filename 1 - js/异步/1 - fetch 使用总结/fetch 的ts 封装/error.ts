// 超时错误
export function isTimeoutError(
  e: TimeoutError | AbortError | ResponseError | Error
): e is TimeoutError {
  return (e as TimeoutError).timeout
}

export class TimeoutError extends Error {
  timeout: boolean

  constructor(message: string) {
    super(message)
    this.timeout = true
  }
}

// 中止错误
export function isAbortError(
  e: TimeoutError | AbortError | ResponseError | Error
): e is TimeoutError {
  return (e as AbortError).abort
}

export class AbortError extends Error {
  abort: boolean

  constructor(message: string) {
    super(message)
    this.abort = true
  }
}

// http 错误
export function isResponseError(
  e: TimeoutError | AbortError | ResponseError | Error
): e is TimeoutError {
  return (e as ResponseError).responseError
}

export class ResponseError extends Error {
  responseError: boolean
  info: Response

  constructor(message: string, info: Response) {
    super(message)
    this.responseError = true
    this.info = info
  }
}
