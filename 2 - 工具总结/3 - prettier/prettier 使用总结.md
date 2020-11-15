
配置 husky 在 commit 前进行校验

eslint-config-prettier 插件：用来使 prettier 和 eslint 结合使用，它会关掉 eslint 的一些规则，然后启用自身的规则。使用 prettier 校验格式，使用 eslint 校验代码质量


#### prettier 的单独使用
prettier 把代码解析成 AST 再按照统一的格式输出

```js
npm install --save-dev --save-exact prettier // 安装固定版本的 prettier，避免不同版本造成格式变化

npx prettier --check src // 校验代码是否符合规则
npx prettier --write src // 按新规则重写
```

#### 配置文件

##### 用于校验的配置文件
查找顺序：被格式的文件一直往上找，直到找到配置文件

优先级：
package.json 的 prettier 字段 ->
.prettierrc ->
.prettierrc.json / .prettierrc.yaml ->
.prettierrc.js / prettier.config.js -> 

配置文件格式：
```js
// prettier.config.js or .prettierrc.js
module.exports = {
  // 引入其它配置包
  ...require("@company/prettier-config"),
 
  // 通用配置
  printWidth: 80,
  semi: false, // 表达式末尾是否要分号
  tabWidth: 2,
  useTabs: false,
  singleQuote: true, // 使用单引号
  quoteProps: "as-needed",
  trailingComma: "none", // 当多行数组/对象时，是否需要尾逗号
  bracketSpacing: true, // 对象前后是否需要空格

  // 特定文件覆盖特定配置
  overrides: [
    {
      "files": "*.test.js",
      "options": {
        "semi": true
      }
    }
  ]
};
```

##### 用于忽略的配置文件
.prettierignore


#### eslint + prettier 的使用
借助 eslint-plugin-prettier 插件，将 prettier 校验和自动修复的功能内嵌到 eslint 中

按照如下步骤：
- 安装包
```js
npm i -D --save-exact prettier // 安装固定版本的 prettier，避免不同版本造成格式变化
npm i eslint eslint-plugin-prettier eslint-config-prettier -D
```

- 初始化 .eslintrc.js
```js
// 通过命令初始化，或者直接新建 .eslintrc.js
npx eslint --init

// 新建 .prettierrc.js 文件
```

- 配置 .eslintrc.js 的 extends，继承 eslint-plugin-prettier 的 recommended 配置
```js
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended' // 此处继承 eslint-plugin-prettier 的 recommended 的配置
  ],
}
```

其中，eslint-plugin-prettier 的 recommended 的配置内部注入了以下内容：
```js
{
  configs: {
    recommended: {
      extends: ['prettier'], // 继承 eslint-config-prettier 的配置，用于关闭 eslint 与 prettier 冲突的 rule 规则
      plugins: ['prettier'], // 使用 eslint-plugin-prettier 插件
      rules: {
        'prettier/prettier': 'error' // 配置 prettier 校验失败时报错
      }
    }
  }
}
```