一个对象常用的操作有：
- 创建：Object.create
- 自身查询：
  - key 键
    - obj.hasOwnProperty
    - Object.keys
    - Object.getOwnPropertyNames 获取可枚举/不可枚举的属性名
    - Object.getOwnPropertySymbols 获取所有可枚举/不可枚举的 symbol 属性名
    - Reflect.ownKeys(obj) 获取所有属性名，包括普通和symbol，不管是否可枚举
  - value 值
    - Object.values
    - Object.getOwnPropertyDescriptors
  - 键值一起查：Object.entries
- 属性定义：
  - obj.key = value 直接赋值
  - Object.defineProperty
- 删除属性：delete obj.key
- 原型
  - Object.getPrototypeOf
  - Object.setPrototypeOf


多个对象之间的操作有：
- 判断是否相同 Object.is
- 对象浅合并 Object.assign










