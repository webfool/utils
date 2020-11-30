const toString = Object.prototype.toString

/**
 * FormData 校验
 * @param val 校验值
 */
export function isFormData(val: any): val is FormData {
  return toString.call(val) === '[object FormData]'
}

/**
 * null校验
 * @param val 校验值
 */
export function isNull(val: any): val is null {
  return toString.call(val) === '[object Null]'
}

/**
 * undefined校验
 * @param val 校验值
 */
export function isUndefined(val: any): val is undefined {
  return toString.call(val) === '[object Undefined]'
}

/**
 * 对象校验
 * @param val 校验值
 */
export function isObject(val: any): val is Record<string, any> {
  return toString.call(val) === '[object Object]'
}

/**
 * 数组校验
 * @param val 校验值
 */
export function isArray(val: any): val is any[] {
  return toString.call(val) === '[object Array]'
}

/**
 * 格式化 get 请求的传参
 * @param data 数据对象，对象的每一项只能是 “数字” 或 “字符串” 或 “数字和字符串组成的数组”
 * @returns 查询字符串
 *
 * 传入 {name: 'xxx', age: 20, other: ['football', 100]}
 * 返回 name=xxx&age=20&other=football&other=100
 */
type QueryData = Record<string, number | string | (number | string)[]>
export function encodeQueryData(data: QueryData) {
  if (!isObject(data)) return ''

  const result: [string, string | number][] = []

  Object.entries(data).forEach(([key, value]) => {
    if (isArray(value)) {
      value.forEach((v) => {
        result.push([key, v])
      })
    } else {
      result.push([key, value])
    }
  })

  return result
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 对象递归格式化：字符串前后去空格、删除值为 null、undefined 的字段
 * @param data 需要格式化的对象
 *
 * 传入
 * {
 *   key1: '  val1  ',
 *   key2: ['  val2-1  ', '  val2-2  '],
 *   key3: {
 *    kkey1: ' vval1 ',
 *    kkey2: undefined,
 *    kkey3: null
 *   },
 *   key4: undefined,
 *   key5: null
 * }
 *
 * 返回
 * {
 *  key1: 'val1',
 *  key2: [ 'val2-1', 'val2-2' ],
 *  key3: {
 *    kkey1: 'vval1'
 *  }
 * }
 */
type TrimObjectType = { [k in string | number]: number | string | TrimObjectType }
export function trimObject(data: TrimObjectType) {
  if (!isObject(data) && !isArray(data)) return data

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      data[key] = value.trim()
    } else if (isObject(value) || isArray(value)) {
      data[key] = trimObject(data[key] as TrimObjectType)
    } else if (isUndefined(value) || isNull(value)) {
      delete data[key]
    }
  })
  return data
}
