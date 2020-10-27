#### 定义格式

```js
{
  ...
  "scripts": {
    "premyScript": "echo before myScript",
    "myScript": "echo $npm_package_name",
    "postmyScript": "echo before myScript"
  },
  ...
}
```
#### 使用方式
```js
npm run myScript

npm run myScript1 & myScript2 // 同时并行执行
npm run myScript1 && myScript2 // 继发执行，前一个成功再执行后一个
```
过程分析：
- 调用 npm run myScript 之后，会按生命周期依次执行 premyScript、myScript、postmyScript
- 执行每个命令时
  - 先将 node_module/.bin 存入环境变量 path 中，再设置好配置信息
  - 根据当前系统是 macOS/linux 或者 windows，选择 /bin/sh 还是 cmd.exe
  - 将脚本放入命令行中执行

#### 脚本内容
脚本内容可以是
- node_module/.bin 定义的命令
- 可以直接是 shell 命令
- node 执行文件

#### 环境变量

可以通过 npm run env 查看 npm 为脚本运行时设置的所有环境变量，介绍几种常见的：
- 【npm_package_xxx】：获取 package.json 中的配置信息，通过 _
获取嵌套内容，如 npm_package_bin_test
- 【npm_config_xxx】：获取 npm 的配置信息
- 【npm_lifecycle_event】：获取当前执行脚本名称

##### 获取方式
- 环境变量可以直接在脚本命令中获取:
```js
{
  "scripts": {
    "myScript": "echo $npm_package_name"
  }
}
```
- 也可以在脚本文件中通过 process.env 获取
```js
// package.json
{
  "scripts": {
    "myScript": "node ./scripts/index.js"
  }
}

// ./scripts/index.js
console.log(process.env.npm_package_name)
```