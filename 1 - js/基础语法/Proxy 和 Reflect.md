#### Proxy 和 Reflect
Proxy 用于在对象前设置一层代理，用于对操作进行过滤或改写。
内部的一些在 Object、Function 上的操作方法，迁移到 Reflect，对于一些命令式操作(如 set、delete)，它可以返回操作结果

Proxy 和 Reflect 结合拦截对象
```js
const obj = {a: 1, b: 2, c: 3}
const p = new Proxy(obj, {
  // === 拦截对象属性查询相关 ===
  has(target, key) { // 拦截 key in obj 语法
    console.log('has')
    return Reflect.has(target, key)
  },
  ownKeys(target) { // 拦截查询 key 列表的方法，包括 Object.keys、Object.getOwnPropertyNames、Object.getOwnPropertySymbols
    return Reflect.ownKeys(target)
  },

  // === 拦截对象值查询相关 ===
  get(target, key, receiver) { // 拦截查询属性 value
    console.log('get', key)
    return Reflect.get(target, key)
  },
  getOwnPropertyDescriptor(target, key) { // 拦截查询属性描述对象
    console.log('getOwnPropertyDescriptor')
    return Reflect.getOwnPropertyDescriptor(target, key)
  },

  // === 拦截对象属性新增相关 ===
  set(target, key, value, receiver) { // 拦截对象新增属性
    console.log('set')
    return Reflect.set(target, key, value)
  },
  defineProperty(target, key, propDesc) {
    console.log('defineProperty')
    return Reflect.defineProperty(target, key, propDesc)
  },

  // === 拦截对象属性删除相关 ===
  deleteProperty(target, key) {
    return Reflect.deleteProperty(target, key)
  },

  // === 拦截原型操作相关
  getPrototypeOf(target) {
    console.log('getPrototype')
    return Reflect.getPrototypeOf(target)
  },
  setPrototypeOf(target, proto) {
    console.log('setPrototypeOf')
    return Reflect.setPrototypeOf(target, proto)
  }
})
```

Proxy 和 Reflect 结合拦截函数
```js
const p = new Proxy(Test, {
  // 拦截直接函数调用，如 fn()、fn.apply(obj, args)、fn.call(obj, ...args)
  apply(target, thisObj, args) {
    Reflect.apply(target, thisObj, args)
  },

  // 拦截函数的作为构造函数被实例
  construct(target, args) {
    return Reflect.construct(target, args)
  }
})
```