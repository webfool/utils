bin 字段用于为包定义一些命令

#### 命令的定义
package.json 中的定义
```js
{
  ...
  "bin": {
    "testBin": "./bin/test" // 注意：一般可执行脚本放在 bin 目录下
  }
}
```

执行脚步中的定义（第一行是固定的）
```js
#! /usr/bin/env node

console.log('testBin!!!')
```

#### 下载之后使用
假设B包中定义了以下的 package.json 配置
```js
{
  ...
  "bin": {
    "testBin": "./bin/test"
  }
}
```
直接在 A 包的命令行中执行 testBin

##### 原理

- 当A包 npm install B 之后，A 包的 node_module/.bin 下会生成一个软链接 testBin，指向 B 包下的 ./bin/test 文件。
- 当在命令行中执行 testBin 时，会先把 A 包的 node_module/.bin 放到全局环境变量中，执行完后再将其从全局环境变量中移除。


#### 开发时使用
```js
// 执行该命令之后，当前包变为全局包，当前包的 bin 命令变成全局命令
npm link
```

##### 原理
该命令做了2件事情：
- 在全局 node_module 下添加当前目录的软链接，之后其它模块便可以直接 import xxx from 'test_module'
- 在全局命令添加当前模块 package.json 的 bin 配置的命令的软链接，指向 bin 配置的地址


如:
```js
/usr/local/lib/node_modules/risk-dc-monitor -> /Users/haowenliu/Desktop/project/personStudy/monitor

/usr/local/bin/testMonitor -> /usr/local/lib/node_modules/risk-dc-monitor/bin/test
```