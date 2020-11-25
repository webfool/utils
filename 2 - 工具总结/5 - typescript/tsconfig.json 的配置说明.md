```js
// 【查找包是否在 @types 下有定义类型的地址】 https://www.typescriptlang.org/dt/search?search=
// 【tsconfig.json 的详细配置说明地址】https://www.staging-typescript.org/tsconfig

{
  // "extends": "./config/base",              /* 继承其它配置文件，同名属性会覆盖被继承的配置文件，相对路径都是相对于各自配置文件 */
  // "include": ["src/parent"],               /* 基于 compilerOptions 下的 rootDir，定义需要编译的内容 */
  // "exclude": ["src/parent/b"],             /* 在 include 的内容中除去不需要编译的内容 */
  // "files": ["src/c.ts"],                   /* 额外需要编译的文件 */
  "compilerOptions": {
    /* Basic Options */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "target": "es5",                          /* [推荐 es5]把 ts 编译成指定版本的 js，可配置值为 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "lib": ["es5", "es6", "dom","es7"],       /* 指定包列表，用于确定 ts 中支持哪些语法。默认情况下跟着 target 确定包，如果需要使用新的api，需要引入其它包 */
    "allowJs": true,                          /* [推荐 true]默认 false，true 代表允许同时存在 ts 和 js 文件，两种类型的文件可以相互引用 */
    "checkJs": true,                          /* [推荐 true]默认 false，true 代表在 js 文件中也会进行类型校验 */
    // "jsx": "preserve",                     /* [推荐 react] 无默认值。定义如何转换 jsx 语法 */
    // "declaration": true,                   /* [推荐 非开源项目一般不需要开启] 在编译的同时生成对应的类型文件 */
    // "declarationMap": true,                /* [推荐 非开源项目一般不需要开启] 默认为 false，true 代表编译生成声明文件的同时生成对应的 sourceMap 文件，即 .d.ts.map */
    // "sourceMap": true,                     /* [推荐 true] 默认为 false，true 代表编译成 js 的同时生成对应的 sourceMap 文件，即 .js.map */
    // "rootDir": "./",                       /* 指定编译的根目录，需要注意的是配置的 include、exclude、files 的路径需要在 rootDir 对应路径之下 */
    // "outDir": "./",                        /* [推荐使用 babel 编译时，不需要关注该配置]指定输出 tsc 编译结果的目录，编译会保留原目录结构 */
    // "outFile": "./",                       /* [不推荐使用] */
    // "removeComments": true,                /* [推荐 false]默认 false，true 代表编译之后把注释删除 */
    "noEmit": true,                           /* [推荐结合 babel 时，置为 true] 关闭将 ts 编译为 js 的功能 */

    /* Strict Type-Checking Options */
    // 实践时，下面所以限制都需要设为 true，所以直接开启 strict 为 true 即可
    /*
     * 类型范围：strictNullChecks
     * 类型推导：noImplicitAny、noImplicitThis
     * 类型校验：
     *  函数：strictFunctionTypes、strictBindCallApply
     *  类：strictPropertyInitialization
     * 编译：alwaysStrict
     */
    "strict": true,                           /* 打开所有的严格校验 */
    // "strictNullChecks": true,              /* [推荐 true]默认 false，true 代表 undefined 和 null 会有单独的类型，这样可以避免一些错误 */
    // "noImplicitAny": true,                 /* [推荐 true]默认 false，true 代表不允许变量的类型推导为 any */
    // "noImplicitThis": true,                /* [推荐 true]默认 false，true 代表不允许 this 的类型推导为 any */
    // "strictFunctionTypes": true,           /* [推荐 true]默认 false，true 代表对于函数类型，值参数类型必须匹配 */
    // "strictBindCallApply": true,           /* [推荐 true]默认 false，true 代表函数通过 call、apply、bind 的方式调用时，参数必须遵照函数定义的类型 */
    // "strictPropertyInitialization": true,  /* [推荐 true]默认 false，true 代表类定义的属性类型必须在 constructor 赋值或者定义时显示赋值 */
    // "alwaysStrict": true,                  /* [推荐 true]默认 false，true 代表以严格模式解析，并且输出的文件会加上 use strict */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./src",                       /* 拓宽非相对路径查找的范围，如果 node_module 找不到则会再到 baseUrl 中查找 */
    "paths": {                                /* [推荐 为较深的路径设置别名]非相对路径映射成配置的相对于 baseUrl 的路径 */
      "@config": ["config"] // require('@config') 时，相当于路径 './src/config' 
    },
    // "rootDirs": [],                        /* [暂觉用得较少]告知编译器 rootDirs 内所有路径内的文件最后都会编译到一个目录里，所以 ts 允许这些文件内按相对路径互相引用 */
    // "typeRoots": [                         /* [推荐 如下配置]声明类型声明的查找路径，默认情况下只会去 node_modules/@types 找类型声明文件(.d.ts)，声明之后在默认路径之外还会去声明路径引入 */
    //   "./typings"
    // ],                       
    // "types": [],                           /* 定义只引入哪些类型声明，默认情况下会引入 typeRoots 下的所有类型声明。引入的这些类型将允许在任意文件内使用 */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Experimental Options */
    "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  },
}
```