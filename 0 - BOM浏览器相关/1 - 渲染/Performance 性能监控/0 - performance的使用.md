


#### performance.navigation
负责记录用户行为信息
```js
/*
 * 【type】 网页的加载来源
 * 0：网页通过地址栏输入、点击链接、表单提交、脚本操作等方式加载
 * 1：网页通过“重新加载”按钮或者location.reload()方法加载
 * 2：网页通过“前进”或“后退”按钮加载
 * 255: 任何其他来源的加载
 * 
 * 【redirectCount】重定向的次数
 */
{
  type: 1,
  redirectCount: 0
}
```

#### 页面相关性能信息
参考下一个文档的详细描述: performance.timing

#### 资源信息
performance 时间列表中每一条测量数据都是一个 performanceEntry 对象。performanceEntry 对象的 entryType 有以下几种类型：
- 【navigation】: name 值为页面URL。
- 【resource】: name 值为请求资源的URL。
- 【paint】: name 为 'first-paint' 或 'first-contentful-paint'。
- 【first-input】
- 【mark】: name 为通过 performance.mark(name) 创建 performanceEntry 对象时传递的name参数
- 【measure】name 为通过 performance.measure(name, beginName, endName) 创建 performanceEntry 对象时传递的第一个参数 name

每种类型都有相对应的属性，但都继承 PerformanceEntry 类型，属性有：
- 【entryType】：当前 performanceEntry 对象的类型
- 【name】：当前 performanceEntry 对象的名称
- 【startTime】：当前 performanceEntry 对象的上报时间
- 【duration】：事件消耗的时间

paint 类型的对象只有以上4种属性。navigation 和 resource 类型的对象还继承了 PerformanceResourceTiming，除去一些时间类型的属性，额外需关注如下属性：
- 【initiatorType】：初始化性能条目的资源类型

值|描述
-|-
navigation|整个页面的加载
script、link、img、iframe| 通过标签形式加载的资源
css|通过css样式加载的资源，如 background-url
xmlhttprequest、fetch|通过 xhr或者 fetch 加载的资源
beacon|


可能的值为 navigation、script、link、css、img、xhrhttprequest、fetch、other
- 【nextHopProtocol】：用于获取资源的网络协议
- 【transferSize】：获取资源的大小（以八位字节为单位)，包含响应头字段和响应体的大小。如果后端返回304，然后从缓存取，那么 transferSize 的大小可能小于 encodedBodySize
- 【encodedBodySize】：解码前，接收的响应内容的大小
- 【decodedBodySize】：解码后，接收的响应内容的大小

##### 添加/删除资源信息
- performance.mark(name)

往时间列表里生成一个用于标记的 performanceEntry 对象
```js
// performance.mark('start') 生成的 performanceEntry 的类型如下
{
  entryType: "mark",
  name: 'start',
  startTime: 1592686.0400000005,
  duration: 0
}
```
- performance.clearMarks(name)

按name清除时间列表中的 mark entry，如果没有 name，那么清除所有 entryType 为 mark 的数据


- performance.measure(name, startName, endName)

往时间列表里生成一个用于测量的 performanceEntry 对象
```js
// performance.measure('between', 'start', 'end')
{
  entryType: 'measure',
  name: 'between',
  startTime: 1592686.0400000005, // 这里的值取开始 mark 时的值
  duration: 5453.15500001004 // 计算开始 mark 和结束 mark 之间的时间差
}
```
- performance.clearMeasures(name)

按name清除时间列表中的 measure entry，如果没有 name，那么清除所有 entryType 为 measure 的数据

- performance.clearResourceTimings()

清除时间列表中的 resource entry

##### 查询资源信息
- performance.getEntries
> 获取时间列表的所有数据，数组按 startTime 排序

- performance.getEntriesByName
> 通过名称获取时间列表数据，数组按 startTime 排序
```js
performance.getEntriesByName('start')
```

- performance.getEntriesByType
```js
performance.getEntriesByType('resource')
```


##### 监听资源信息
- PerformanceObserver
```js
var observer = new PerformanceObserver(function(list, obj) {
  var entries = list.getEntries(); // 获取监听到的时间列表数据
});

observer.observe({entryTypes: ['mark']})

performance.mark('start') // 触发事件
```

#### performance.memory

查询内存信息
- usedJSHeapSize: 当前 JS 占用的内存数，按字节算
- totalJSHeapSize: 已分配的内存数，按字节算
- jsHeapSizeLimit: 可用内存的最大数，按字节算

#### performance.timeOrigin

返回页面第一次被创建的时间，它与 performance.timing 的 navigationStart 相近，但更精确
```js
performance.timing.navigationStart // 1603261721098
performance.timeOrigin // 1603261721098.2861
```
#### performance.now

返回 performance.navigationStart 到当前的毫秒数
```js
var st = performance.now();
for (var o = 0; o < 10000; o ++)  console.log(o)
var end = performance.now();

console.log(`for时间${end - st}`); // for时间1155.9950000373647
```


