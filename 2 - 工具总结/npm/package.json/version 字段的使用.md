### 版本号格式
##### 普通 version 的格式：主版本号(major).次版本号(minor).修订号(patch)
- 主版本号：大版本改动，可能不再兼容旧的 API
- 次版本号：在原基础上添加新功能，兼容旧的 API
- 修订号：修复一些bug

如 16.8.2

##### 先行版本的格式：主版本号.次版本号.修订号-先行版本类型.次数

> 次数从 0 开始

先行版本类型：
- alpha：内部测试版
- beta：公测版
- rc：(Release Candidate) 正式版本的候选版本

如 1.0.0-alpha.0、1.0.0-beta.1、1.0.0-rc.0

### 管理npm的版本

执行下面命令之后会自动在对应的版本位置加一，并以版本号为 message 进行 commit，并且新增 git tag，格式为 v<版本号>。
```js
npm version major // 升级主版本
npm version minor // 升级次版本
npm version patch // 升级补丁版本
```
如执行命令之后版本为 1.1.1，那么会生成一条 commit 的 message 为 1.1.1，同时生成一个 git tag 为 v1.1.1

如果想自定义 commit 信息，和 tag 信息，可以
```js
npm version patch -m 'xxx' // 自定义的信息
npm config set tag-version-prefix 'xxx' // 自定义 tag 的前缀
```

### package.json 依赖版本说明
- 兼容补丁版本：16.2.x、16.2、~16.2.2 (代表 16.2.2 之后的所有补丁版本都可以)
- 兼容小版本和补丁版本：16.x、16、^16.2.2 (代表 16.2.2 之后的所有不更新大版本的都可以)
- 兼容所有版本：*、x

需要注意的是：^ 符号的范围只能包含第一个不为0的位不变动的情况
```js
semver -r ^0.12.0 0.12.1 0.12.2 0.13.1 0.13.2
// 结果
0.12.1
0.12.2
```