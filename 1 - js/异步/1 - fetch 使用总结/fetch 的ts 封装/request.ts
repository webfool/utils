/**
 * fetch 封装思路
 * - 使用方式
 * ｜(x) 对外封装 get、post、put、patch、delete 方法
 * - 请求前的拦截
 * ｜开启请求
 *  ｜(x) url 添加 baseUrl
 * | 设置头部
 *  ｜(x) 允许携带 cookie
 *  ｜? 请求条件 requestId 字段
 *  ｜(x) 允许自定义头部
 * ｜设置请求体
 *  ｜(x) 请求数据去除空字段
 *  ｜(x) 请求数据字段前后去空格
 *  ｜(x) data 按请求方式转化
 * ｜其它
 *  ｜请求缓存功能
 *  ｜(x) 允许请求时开启全局 loading
 *  ｜(x) 允许跨域
 * - 返回结果处理
 * ｜清除请求缓存
 * ｜(x) 错误统一提示
 * ｜(x) 是否关闭全局 loading
 * ｜配置是否401跳转登陆页
 * - 请求过程功能
 * ｜(x) 取消请求功能
 *  ｜(x) 支持传入取消请求的回调
 * ｜(x) 超时功能
 *  ｜(x) 支持传入超时的回调
 * ｜(x) 进度功能
 *  ｜(x) 支持传入进度变化的回调
 */
import { Toast } from 'antd-mobile'
import { encodeQueryData, isFormData, trimObject } from '.'
import {
  TimeoutError,
  AbortError,
  ResponseError,
  isTimeoutError,
  isAbortError,
  isResponseError
} from './error'

const DEFAULT_BASEURL = ''
const DEFAULT_TIMEOUT = 10000
const DEFAULT_OPTIONS = {
  credentials: 'include',
  mode: 'cors'
}
type AnyObject = Record<string, any>
interface RequestOptions extends RequestInit {
  baseUrl?: string
  timeout?: number
  loading?: boolean
  onAbort?: (...args: any[]) => any
  onTimeout?: (...args: any[]) => any
  onResponseError?: (...args: any[]) => any
  onProcess?: (...args: any[]) => any
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
interface RequestPromise<T> extends Promise<T> {
  abort: () => void
}
function request<T>(
  method: Method,
  url: string,
  data: AnyObject = {},
  options: RequestOptions = {}
): RequestPromise<T> {
  const {
    baseUrl,
    timeout,
    loading,
    headers = {},
    onAbort,
    onTimeout,
    onResponseError,
    onProcess,
    ...InitOptions
  } = options

  // 设置请求method 和 url
  let requestUrl = url.startsWith('http') ? url : (baseUrl || DEFAULT_BASEURL) + url
  const requestOptions: RequestInit = {
    method
  }

  // 将自定义的 headers 转成对象格式
  const customHeaders = [...new Headers(headers).entries()].reduce(
    (h, [key, value]) => {
      h[key] = value
      return h
    },
    {} as Record<string, any>
  )
  const defaultHeaders: Record<string, any> = {}

  // 对数据中的字符串进行前后去空格，并删除数据中的 undefined 和 null 字段
  data = trimObject(data)
  // 设置请求体
  if (method === 'GET') {
    const queryData = encodeQueryData(data)
    queryData && (requestUrl += `?${queryData}`)
  } else if (isFormData(data)) {
    requestOptions.body = data
  } else {
    requestOptions.body = JSON.stringify(data)
    // 注意：
    // 因为经过 new Headers 处理之后的 customHeaders 中 content-type 字段为小写
    // 为了能够实现对象的key的覆盖，此处也必须是小写的 content-type
    defaultHeaders['content-type'] = 'application/json'
  }

  // 合并默认头和自定义头
  requestOptions.headers = new Headers({
    ...defaultHeaders,
    ...customHeaders
  })

  let abort: (...args: any[]) => any
  const fetchPromise = new Promise((resolve, reject) => {
    // 设置超时功能
    const timeoutPromise = new Promise<Response>((timeoutResolve, timeoutReject) => {
      abort = timeoutReject
      setTimeout(() => {
        // 抛出超时错误
        timeoutReject(new TimeoutError('timeout'))
      }, timeout || DEFAULT_TIMEOUT)
    })

    if (loading) {
      Toast.loading('loading...', 0)
    }
    Promise.race<Promise<Response>>([
      fetch(requestUrl, Object.assign(requestOptions, DEFAULT_OPTIONS, InitOptions)),
      timeoutPromise
    ])
      .then((res: Response) => {
        // 当接受完 http 响应头之后，会触发此回调
        const { body } = res

        // 添加下载进度功能
        const stream = new ReadableStream({
          start(controller) {
            if (body) {
              const reader = body.getReader()
              const total = res.headers.get('content-length')
              let loaded = 0

              const consume = () => {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close()
                    return
                  }

                  const byteLength = value ? value.byteLength : 0
                  loaded += byteLength
                  controller.enqueue(value)

                  if (typeof onProcess === 'function') {
                    if (total === null) {
                      console.log(`received ${loaded} bytes.`)
                    } else {
                      console.log(
                        `received ${loaded} of ${total}. (${((loaded / +total) * 100).toFixed(
                          2
                        )}%!)`
                      )
                    }
                    onProcess(value)
                  }

                  consume()
                })
              }
              consume()
            } else {
              controller.close()
            }
          }
        })

        return new Response(stream, {
          headers: res.headers,
          status: res.status,
          statusText: res.statusText
        })
      })
      .then((res: Response) => {
        const { status } = res
        if ((status >= 200 && status < 300) || status === 304) return res.json()

        // 抛出 http 错误
        throw new ResponseError(res.statusText, res)
      })
      .then((res: any) => {
        // 关闭全局 loading
        if (loading) Toast.hide()

        resolve(res)
      })
      .catch((e: AbortError | TimeoutError | ResponseError | Error) => {
        // 情况分为：网络异常、超时、http 状态码不在 [200, 300) / 304、其它报错
        console.log('error happen ->', e.message || 'request error')
        if (isTimeoutError(e) && typeof onTimeout === 'function') onTimeout(e)
        if (isAbortError(e) && typeof onAbort === 'function') onAbort(e)
        if (isResponseError(e) && typeof onResponseError === 'function') onResponseError(e)

        // 关闭全局loading，并进行错误提示
        if (loading) Toast.hide()
        Toast.fail(e.message)
        reject(e)
      })
  })
  ;(fetchPromise as RequestPromise<T>).abort = function() {
    // 抛出中止错误
    abort(new AbortError('abort'))
  }
  return fetchPromise as RequestPromise<T>
}

export default {
  get<T>(url: string, data: AnyObject = {}, options: RequestOptions = {}) {
    return request<T>('GET', url, data, options)
  },
  post<T>(url: string, data: AnyObject = {}, options: RequestOptions = {}) {
    return request<T>('POST', url, data, options)
  },
  patch<T>(url: string, data: AnyObject = {}, options: RequestOptions = {}) {
    return request<T>('PATCH', url, data, options)
  },
  put<T>(url: string, data: AnyObject = {}, options: RequestOptions = {}) {
    return request<T>('PUT', url, data, options)
  },
  delete<T>(url: string, data: AnyObject = {}, options: RequestOptions = {}) {
    return request<T>('DELETE', url, data, options)
  }
}
