#### 流程图
![](http://note.youdao.com/yws/public/resource/a18267479fe7cfd01070f74826b9c04b/xmlnote/408EA1183CF94DDDA4301BCD19C1E07F/38275)

#### 相关节点说明
字段|描述
-|-
navigationStart|开始的时间戳
redirectStart|开始重定向
redirectEnd|重定向结束
fetchStart|开始请求数据
domainLookupStart|开始解析域名
domainLookupEnd|结束域名解析
connectStart|tcp开始连接
secureConnectionStart|加密连接开始
connectEnd|tcp结束连接
requestStart|开始发起请求
responseStart|开始返回数据
responseEnd|结束返回数据
unloadEventStart|开始前一个页面卸载
unloadEventEnd|结束前一个页面卸载
domLoading|开始解析页面
domInteractive|dom解析完成的时间。时间线应该是：domLoading -> domInteractive -> defer 脚步执行 -> DOMContentLoaded -> domComplete -> load
domContentLoadedEventStart|DOMContentLoaded 事件开始
domContentLoadedEventEnd|DOMContentLoaded 事件结束
domComplete|所有资源准备完毕的时间
loadEventStart|load事件开始
loadEventEnd|load事件结束

#### 相关性能数据计算
上报字段|描述|计算规则|意义
-|-|-|-
redirect|重定向时间|redirectEnd - redirectStart| 拒绝重定向
appCache|读取缓存耗时|domainLookupStart-fetchStart
dns|DNS解析耗时|domainLookupEnd - domainLookupStart|是否有做 DNS 预加载
tcp|TCP连接耗时|connectEnd - connectStart
ssl|ssl安全连接耗时|connectEnd - secureConnectionStart
ttfb|Time To First Byte 接收到首字节所消耗的时间|responseStart - requestStart|是否加 CDN，是否加带宽、是否加 CPU 运算速度等
response|内容加载耗时|responseEnd - responseStart|是否经过 gzip 压缩、静态资源 css/js 是否压缩
fpt|First Paint Time 请求开始到浏览器首次解析第一批HTML文档字节的时间差|responseEnd - fetchStart|【重要】
unload|前一个页面卸载耗时|unloadEventEnd - unloadEventStart
dom|dom解析耗时|domInteractive - domLoading|DOM结构是否合理，是否有 JS 阻塞
tti|Time to Interactive 首次可交互时间|domInteractive - fetchStart|【重要】
dcl|DomContentLoad 耗时|domContentLoadedEventEnd - domContentLoadedEventStart|
domReady|html 加载完成时间|domContentLoadedEventEnd - fetchStart
fp|浏览器绘制非默认背景的第一帧的时间，可当作白屏时间使用|performance.getEntriesByName('first-paint')[0].startTime|fp和fcp都是在 domContentLoaded 事件完成之后才触发
fcp|浏览器绘制文本、图片、非空白的canvas 或 SVG 的第一帧的时间。|performance.getEntriesByName('first-contentful-paint')[0].startTime|fp和fcp都是在 domContentLoaded 事件完成之后才触发
loadEvent|onLoad事件耗时|loadEventEnd - loadEventStart
loadPage|页面完全加载可用的事件|loadEventEnd - fetchStart|几乎代表用户等待可用的时间
