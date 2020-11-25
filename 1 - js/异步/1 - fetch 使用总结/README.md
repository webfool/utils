#### 结构
- fetch
  - 发起请求
    - 开启：fetch(url, {method: 'GET'})
    - 设置请求头
      - options.headers
      - cookies: credentials
    - 设置请求体：options.body
    - 设置对请求的要求
      - mode: 同源/支持跨域
  - 处理响应
    - 监听事件
      - catch：处理网络异常
      - then：处理有响应的情况
    - 有响应时，获取响应结果
      - 状态码：response.status
      - 响应头：response.headers
      - 响应体：response.text()、json、blob、arrayBuffer、formData

#### fetch 发起请求
fetch 有两种调用方式:
- fetch(url, options)：url 和配置的形式
- fetch(req, options)：Request 对象和配置的形式

两种调用方式的参数都会传递给 Request 构造函数，再生成 request 实例。

##### Request 构造函数
两种调用方式：
- new Request(url, options)
- new Request(req, options)：可以传入一个 request 对象进行克隆

##### options
和 xhr 比，缺少超时和 responseType 的设置

- mode
  - *same-origin：只支持同源请求
  - cors: 支持发起跨域请求
  - no-cors: 暂时没有用到
- method: 请求的方法，不区分大小写
- headers: 请求头信息，可以为 Header 实例，也可以是对象字面量。如果没有设置会content-type，请求会尝试根据body内容设置头信息
```js
// Headers 的使用，提供以下方法：append, set, delete, has, get
// 也支持遍历：entries、keys、values、forEach
const headers = new Headers({
  "Content-Type": "text/plain",
  "X-Custom-Header": "ProcessThisImmediately",
})

headers.append("X-Custom-Header", "AnotherValue"); // 新增
headers.get("X-Custom-Header"); // 获取请求头的值，ProcessThisImmediately, AnotherValue
headers.set('content-type', 'application/json') // 修改
headers.delete('content-type') // 删除
headers.has("Content-Type") // 判断是否存在头
```
- credentials: 是否携带 cookies
  - *omit: 不携带
  - same-origin: 同源的时候携带
  - include: 同源和非同源都携带
- cache: 缓存策略，一般不需要设置
  - *default: 请求之前检查缓存是否过期，没过期再用缓存，过期再发起请求
  - force-cache: 请求前检查是否有缓存，只要有，不管是否过期，都用缓存，否则再发起请求
  - reload、no-cache: 不使用缓存，直接发起请求，请求之后能够更新缓存
  - only-if-cached: 只使用缓存，缓存没有就结束
  - no-store：不使用缓存，不也会将请求的资源进行缓存
- body: 请求的信息，支持 。GET 和 HEAD 不能有该参数，如果传递了 fetch 直接 reject 报错
  - json的序列化字符串：需要在 header 中主动设置 content-type: 'application/json;charset=utf-8'
  - url查询字符串：需要在 header 中主动设置 content-type: 'application/x-www-form-urlencoded;charset=utf-8'
  - URLSearchParams: 默认会设置 content-type: application/x-www-form-urlencoded;charset=UTF-8
  - FormData: 默认会设置 content-type: multipart/form-data; boundary=xxx
  - Blob

#### fetch 接收返回结果
fetch 网络错误会走 catch，其它情况会走 then

fetch 的 response 包含如下属性：
- type: 请求的类型
  - basic: 同源请求
  - cors: 跨域请求
  - opaque: Request mode 设置为 “no-cors”的响应
  - error: 出错
- url: 响应的地址
- headers: 响应头
- status: 状态码
- statusText: 状态信息
- ok: 状态码在 200 ~ 299 为 true，其它为 false

fetch 的 response 包含如下方法：
- clone: 克隆一份响应信息
- text: 将数据转为 text 之后从 promise resolve 出来
- json: 将数据转为 json 之后从 promise resolve 出来
- blob: 将数据转为 blob 之后从 promise resolve 出来
- arrayBuffer: 将数据转为 arrayBuffer 之后从 promise resolve 出来
- formData: 将数据转为 formData 之后从 promise resolve 出来
