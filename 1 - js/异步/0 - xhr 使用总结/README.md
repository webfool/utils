
## 总结
- xhr.onreadystatechange 放在 open 方法之前，这样才可以监听 open 时将状态改为1的情况
- 不管什么情况，最后都会把 readyState = 4并执行 onreadystatechange，而且会执行 onloaded 事件
- 事件的较佳使用方式
```js
xhr.addEventListener('abort', function () {}, false) // 监听中止事件
xhr.addEventListener('timeout', function () {}, false) // 监听超时事件
xhr.addEventListener('error', function () {}, false) // 监听网络错误事件
xhr.addEventListener('load', function () { // 在 load 事件中区分是成功还是失败
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    // 进行成功的操作
  } else {
    // 进行失败的错误
  }
}, false)
```
## 测试代码
```js
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function (e) {
  // e.type = 'readystatechange'
  console.log('onreadystatechange e ->', e)
  console.log('onreadystatechange ==>', xhr.readyState, xhr)
}
xhr.open('GET', '/demo')

xhr.timeout = 2000
xhr.responseType = 'json'

xhr.addEventListener('abort', function (e) {
  // e.type = 'abort'
  console.log('abort e ->', e)
}, false)

xhr.addEventListener('timeout', function (e) {
  // e.type = 'timeout'
  console.log('timeout e ->', e)
}, false)

xhr.addEventListener('error', function (e) {
  // e.type = 'error'
  console.log('error e ->', e)
}, false)

xhr.addEventListener('load', function (e) {
  console.log('load e ->', e, typeof xhr.response, xhr.response)
}, false)

xhr.addEventListener('loadend', function (e) {
  // e.type = 'loadend'
  console.log('onloaded e ->', e)
}, false)

xhr.send(null)

// setTimeout(() => {
//   xhr.abort()
// }, 2000)
```


## 发起前
#### 开启请求 open
> XMLHttpRequest.open(method, url, async, user, password)

该方法中，async 默认为 true 代表异步，false 代表同步，同步时 send 方法会一直等待请求结束，且不能设置超时时间，所以不应该设置为 false。user 和 password 基本没用，所以最后的用法只需要是 XMLHttpRequest.open(method, url)。

- method 方法可以为 GET、POST、PUT、PATCH、DELETE 等，大小写不敏感

#### 设置 request header
> setRequestHeader(header, value)
- 必须在 open() 方法之后，send() 方法之前调用
- 通过 setRequestHeader 方法添加请求头信息，多次调用不会覆盖，而是追加
```js
// 第一个参数 header 大小写不敏感，即 content-type、Content-Type 等效
let client = new XMLHttpRequest()
client.open('GET', '/demo')
client.setRequestHeader('X-Test', 'one')
client.setRequestHeader('X-Test', 'two')
// 最终 request header 中的 X-Test 为 one, two
client.send()
```

#### 设置跨域携带认证信息
> xhr.withCredentials = true

浏览器在跨域请求时，默认不发送认证信息，需要显式设置 withCredentials 为 true。设置之后浏览器预检时需要服务器返回的头信息中包含了 Access-Control-Allow-Credentials: true，并且 Access-Control-Allow-Origin 不能为 *，必须设置为请求页面的域名。

#### 设置请求超时时间
> xhr.timeout 单位为毫秒，默认为0，代表不超时

xhr.send() 开始计算请求时间，xhr.loaded 事件代表请求结束

#### 设置返回数据被转化的类型
> xhr.responseType = 'json'

设置 xhr.responseType 之后，请求成功之后会将数据转成对应类型存入 xhr.response 中。
值|xhr.response
-|-|
""，未设置时的默认值|String|
"text"|String
"json"|Javascript对象
"blob"|Blob对象
"arraybuffer"|ArrayBuffer对象
"document"|Document对象，会将数据转化成一个 document 对象，把文本信息插入到 body 标签内

#### 发送的数据类型
> xhr.send(data) 

data 可以的数据类型有：
- null，如果 GET 请求，send 不传或传 null，如果传了其它也会被转为 null
- DOMString，默认设置 content-type: text/plain;charset=UTF-8
- FormData，默认设置 content-type: multipart/form-data;boundary=[xxx]
- Blob
- ArrayBuffer
- Document，如果是 HTML Document 类型，默认设置 content-type: text/html;charset=UTF-8，否则默认设置 application/xml;charset=UTF-8

发送 json 的方式
```js
const data = {a: 1}
const xhr = new XMLHttpRequest()
xhr.open('POST', '/demo')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send(JSON.stringify(data))
```
## 发起后

#### xhr 相关事件
> 通过 xhr.addEventListener(eventName, fn, false) 监听事件

事件顺序：onloadstart - onabort - ontimeout - onprogress - onerror/onload - onloadend

- onloadstart: 调用 xhr.open() 之后立即触发
- onabort: 调用 xhr.abort() 之后触发
- ontimeout: 从 onloadstart 开始计算，达到 xhr.timeout 的时间触发
- onprogress: 分上传时的 xhr.upload.onprogress 和下载时的 xhr.onprogress。上传时，在 xhr.send() 和 xhr.readystate=2 的中间每隔 50ms 触发一次；下载时，即 xhr.readyState=3 的阶段，每隔 50ms 触发一次。
```js
// 获取上传或下载进度
function updateProgress(event) {
  if (event.lengthComputable) {
    let completedPercent = event.loaded / event.total
  }
}
xhr.onprogress = updateProgress
xhr.upload.onprogress = updateProgress
```
- onerror: 网络层级别的异常触发此事件，对于应用层级别的异常，如 xhr.statusCode 是4xx 并不属于网络层级异常，不会触发 onerror 事件，而是走 onload。如果是上传过程中发生网络异常，会先触发 xhr.upload.onerror 再触发 xhr.onerror
- onload: 请求完成时触发，此时 xhr.readyState=4
- onloadend: 请求结束时触发，不管是 abort、timeout、error、load，最后都会触发 onloadend

全局事件：onreadystatechange
- onreadystatechange: xhr.readyState 代表不同阶段，每次 xhr.readState 变化都会触发 xhr.onreadystatechange

```js
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  switch(xhr.readyState) {
    case 1: // 调用 open()
      ...
      break;
    
    case 2: // 调用 send()，并且已经上传成功数据，已接收到返回响应头和响应状态
      ...
      break;

    case 3: // 正在下载响应体
      ...
      break;

    case 4: // 整个数据传输过程结束
      ...
      break;
  }
}
```
注意：当触发 abort、timeout、error 时，readyState 会直接跳转到 4

##### 整个正常请求的事件触发顺序：
- xhr.onloadstart
  - 【上传阶段开始】
  - xhr.upload.onloadstart
  - xhr.upload.onprogress
  - xhr.upload.onload
  - xhr.upload.onloadend
  - 【上传阶段结束】
- xhr.onprogress
- xhr.onload
- xhr.onloadend

#### 获取 response header
头信息并非都能被获取，浏览器有如下限制：
- 无法获取 Set-Cookie 和 Set-Cookie2 两个字段的头信息
- 跨域请求只能获取简单头信息和 "Access-Control-Expose-Headers" 暴露的头信息。其中简单头有：Content-Type、Content-Language、Expires、Cache-Control、Last-Modified、Pragma

通过两个方法获取返回头信息：
- xhr.getAllResponseHeaders() 获取所有头信息
- xhr.getResponseHeader() 获取特定头信息

## 获取 xhr.response 
responseType|response|responseText|responseXML
-|-|-|-
''|☑️|☑️|x
'text'|☑️|☑️|x
'json'|☑️|x|x
'blob'|☑️|x|x
'arraybuffer'|☑️|x|x
'document'|☑️|x|☑️

总结是：所有的 responseType 都能取 xhr.response，'' 和 text 能额外再取 xhr.responseText, 它的值等同于 xhr.response; document 能额外再取 responseXML，它的值等同于 xhr.response，所以最终不管 responseType 是什么，都取 xhr.response 即可。


如果xhr 请求成功，但不满足 200 <= xhr.status < 300 或者 xhr.status === 304, 那么获取失败信息的方式应该为：
-  ''、text、json 直接取 xhr.response，其中 '' 和 text 都能取到后端返回的信息，而 json 取到的是 null
- blob
```js
const fileReader = new FileReader()
fileReader.onload = function () {
  const result = this.result
  console.log('result ->', result) // 此处获取到后端返回的信息
}
fileReader.readAsText(blob)
```
- arraybuffer
```js
const decoder = new TextDecoder()
const result = decoder.decode(xhr.response)
console.log('result ->', result)
```
