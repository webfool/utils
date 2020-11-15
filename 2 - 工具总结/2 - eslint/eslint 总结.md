### 总结
```js
npm i eslint -D
npx eslint --init
```

- 【批量】eslint 可以依据 .eslintrc.js 配置文件进行校验和修复，通常在git commit 前校验和修复
- 【单次处理】vscode 的 eslint 插件用于在编辑器提示错误并监听保存操作，自动修复文件错误

#### eslint 结构
- 代码风格校验/修复
  - prettier
    - 注入 prettier 的校验和修复功能
    - 关闭 prettier 和 eslint 冲突的校验规则
    - 配置 .prettierrc.js
- 代码质量校验/修复
  - 包含
    - 配置文件
      - 怎么找
        - 当前目录的查找顺序
        > 同一目录下的文件选择顺序：.eslintrc.js > .eslintrc.yaml > .eslintrc.json > package.json
        - 往上查找的配置合并
        > 调用 eslint 时，将从当前目录一直往上找配置文件，直到根目录或者配置文件的 root: true 并进行合并，内层的会覆盖外层的
      - 怎么配置
        - 配置解析器
          - parser：常见的有 espree、@babel/eslint-parser、@babel/eslint-parser
          - parserOptions
          ```js
          // 常用 parser 和 parserOptions 配置

          // espree：默认的 parser，只能解析已成为标准的js语法
          {
            parser: "espree",
            parserOptions: {
              sourceType: 'script',
              ecmaVersion: 6, // 支持的js语法版本
              ecmaFeatures: {
                impliedStrict: true, // 是否开启全局严格模式
                jsx: true // 是否支持 jsx 格式
              }
            }
          }

          // @babel/eslint-parser：能解析一些 babel 支持的较新的语法
          {
            parser: "@babel/eslint-parser",
            parserOptions: {
              sourceType: "script"
            }
          }

          // 【@typescript-eslint/parser】：解析 ts 语法，对于同名文件，优先级：.ts .tsx .d.ts .js .jsx
          // 【@typescript-eslint/eslint-plugin】：扩展一些 typescript 的规则，如 校验 interface 优先等
          // npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
          {
            parser: "@typescript-eslint/parser",
            parserOptions: {
              project: "./tsconfig.json", // 定义配置文件路径，可以是路径数组
              projectFolderIgnoreList: "**/node_modules/**", // 配置忽略的文件路径，可以是路径数组
              ecmaFeatures: {
                // js、jsx、tsx 默认支持jsx，ts 不支持 jsx。当前配置仅在未定义 project 时用于配置其它类型的文件，不对 js jsx tsx 生效
                jsx: true 
              }
            },
            plugins: ['@typescript-eslint'],
          }
          ```
        - 配置全局变量
          - env
          - globals
        - 配置规则：eslint 存在规则池
          - plugins：定义新校验规则、组合配置
          ```js
          // 插件的实现格式：
          {
            rules: { // 定义新规则
              'jsx-boolean-value': {
                meta: {
                  ...
                },
                create(context) {}
              }
            },
            configs: {
              recommended: {
                plugins: ['react'],
                parserOptions: {
                  ecmaFeature: {
                    jsx: true
                  }
                },
                rules: {...}
              }
            }
          }

          // 插件名称格式：eslint-plugin-react，使用时省略前缀
          {
            "plugins": [
              "react", // 引入 eslint-plugin-react 插件
              "@foo/bar" // 引入 @foo/eslint-plugin-bar 插件
            ]
          }
          ```
          - extends：集成 plugins 的组合配置或其它组合配置包，通常用来扩展规则组
          ```js
          {
            "plugins": ["react"],
            "extends": [
              "standard", // 使用 eslint-config-standard 包的配置
              "plugin:react/recommended" // 使用 react 插件的 recommended 配置，格式为：plugin:<插件名>/<配置名>
            ]
          }
          ```
          - rules：调用或者覆盖规则
          ```js
          覆盖方式：
          - 【不覆盖规则的 options】 "eqeqeq": "warn"
          - 【覆盖规则的 options】"eqeqeq": ["warn", "allow-null"]

          值的意义：
          - off / 0: 关闭校验
          - warn / 1: 如果校验不合格，则提示，但不终止运行
          - error / 2: 校验不合格终止运行
          ```
          - 内联规则
  - 忽略
    - 默认忽略
      - node_modules/
      - 点文件/点文件夹
    - 主动忽略
      - config 中配置 ignorePatterns 字段，内容路径相对于配置文件目录 (推荐，因为 eslint 只会找当前目录下的 .eslintignore，所以 vscode 打开项目的父级目录时，vscode 的 eslint 读取 .eslintignore 会失败，造成提示错误)
      - 配置 .eslintignore 文件（优先级更高），内容路径相对于配置文件目录
    - 校验忽略的文件
      - 校验默认忽略的文件
        - 目录：eslint .dotDir
        - 文件：eslint .dotDir/file.js --no-ignore
        - 通过配置文件
          ```js
          !.build # 先取反，关闭默认忽略
          .build # 再手动忽略
          !.build/test.js # 再放开特定文件
          ```
      - 校验主动忽略的文件
        - 目录：无法校验
        - 文件：eslint test.js --no-ignore


#### 配置字段说明
```js
{
  "parser": "espree", // 解析器
  "parserOptions": {}, // 解析器配置

  "env": { // 定义环境
    "node": true, // 将某个环境设置为 true 即可
    "browser": true,
    "example/custom": true // 使用插件的定义的环境
  },
  "globals": { // 定义全局变量
    "var1": "off" // 值可以设置 off(关闭) writable(可修改) readonly(不可修改)
  },

  "plugins": ["example"], // 使用插件
  "extends": ["exampleExtends"], // 继承配置
  "rules": { // 重写规则
    "curly": "error",
    "quotes": ["error", "double"],
    "example/rule1": "error"
  },

  "overrides": [ // 定义特定文件使用某些规则
    {
      "files": ["*-test.js","*.spec.js"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],
  "noInlineConfig": true, // 不允许使用注释类配置
  "root": true // 是否根配置文件，子目录往上找到该配置文件后将不再继续往父级目录查找
}
```
#### eslint + prettier + ts 配置

##### 包安装
```js
npm install -D eslint // eslint 校验的核心包

npm install -D typescript // typescript-parser 需要依赖 typescript
npm install -D @typescript-eslint/parser // typescript 语法的解析器
npm install -D @typescript-eslint/eslint-plugin // typescript 在 eslint 中推荐的规则

npm i -D --save-exact prettier // 精确安装 prettier 版本
npm i -D eslint-plugin-prettier // 将 prettier 校验和修复功能注入 eslint 的插件
npm i -D eslint-config-prettier  // 关闭 eslint 和 prettier 冲突的规则
```

##### 配置 .eslintrc.js
```js
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // 使用@typescript-eslint/eslint-plugin的推荐规则
    /**
     * 配置 prettier 用于校验和自动修复格式问题
     * 使用 prettier 插件的 recommended 配置，它包括注入
     * {
     *    plugins: ['prettier'],
     *    rules: {
     *      'prettier/prettier': 'error'
     *    },
     *    extends: ['prettier'] // 使用 eslint-config-prettier 关闭 eslint 和 prettier 冲突的规则
     * }
     */
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'] // 覆盖 typescript 校验规则
  }
}
```

##### 配置 .prettierrc.js
```js
module.exports = {
  // 通用配置
  printWidth: 80,
  semi: false, // 表达式末尾是否要分号
  tabWidth: 2,
  useTabs: false,
  singleQuote: true, // 使用单引号
  quoteProps: "as-needed",
  trailingComma: "none", // 当多行数组/对象时，是否需要尾逗号
  bracketSpacing: true, // 对象前后是否需要空格
}
```

##### 配置 husky
husky 用于为 git 的不同阶段配置钩子，并允许外部传入钩子的执行内容。

```js
npm i -D husky
```

安装完成之后会提示如下两句，代表安装成功，即已经在当前包的 .git/hooks 下配置了不同阶段的钩子，当触发这些钩子时，会去 package.json 的 husky 配置中找到对应命令并执行
```js
husky > Setting up git hooks
husky > Done
```

```js
// package.json
{
  ...
  "husky": {
    "hooks": {
      // "pre-commit": "echo i am pre commit!"
      "pre-commit": "lint-staged"
    }
  }
}
```

##### 配置 lint-staged
lint-staged 用于将 git add 的内容按规则过滤出来，再交由一些命令进行操作。
```js
npm i -D lint-staged
```

lint-staged 调用时
- 将会去 package.json 的 lint-staged 找配置（也可以是其它配置方式）
- 然后通过 key 的过滤模式过滤出已经提交的文件
- 再把匹配文件的绝对路径作为参数传给 value 的每一个命令

如果需要忽略某些文件，直接在对应的命令配置文件定义(如 .eslintrc.js)
```js
{
  "lint-staged": {
    // 支持带路径的配置模式(file/*/*.js)和不带路径的匹配模式(*.js)
    // 命令支持 npm 安装的命令和 $path 内部的命令；命令支持单个和多选
    // 常见的命令 ["prettier --write", "eslint --fix", "git add"] ，因为使用了 eslint-plugin-prettier 插件，所以只需要 eslint --fix 即可
    "src/*": ["eslint --fix"] // 格式化之后直接提交成功
  }
}
```

##### 配置 commitlint
commitlint 用于限制 git commit 的 message 内容格式
```js
// 安装 @commitlint 作用域下的3个包：cli(用于执行校验命令)、config-conventional(通用配置)、prompt-cli(按配置引导输入commit 信息)
npm i -D @commitlint/{cli,config-conventional,prompt-cli}
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

```js
// package.json
{
  "scripts": {
    "commit": "commit" // 添加 npm run commit 命令，用于引导输入 commit
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // git commit 时校验提交信息
    }
  }
}
```