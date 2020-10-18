- dependencies 和 dev-dependencies 的区别
webpack 打包时只会去 node_module 中取，如果在自己项目中 npm install，那么会同时安装 dependencies 和 dev-dependencies 的包，所以把包放在 dependencies 或 dev-dependencies 其实区别不大。但如果是依赖于其它包，npm install 只会安装依赖包中的 dependencies，为保证依赖包能正常使用，所以依赖包的所有依赖应该放在 dependencies 中，故统一规范，即 dependencies 放生产依赖包，dev-dependencies 放开发依赖包。

- 通过 npm 定义 script 时，script 的命令会去 node_module 中查找