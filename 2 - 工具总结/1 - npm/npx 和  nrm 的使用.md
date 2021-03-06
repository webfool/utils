### npx
通过 npx 运行本地或远程模块

##### npx 运行过程：
- 先将 node_module/.bin 路径加入环境变量里
- 寻找模块，如果没有找到，则先下载到临时目录，然后执行；如果是下载到临时目录的，则会在执行完之后删除


##### npx 的运行命令
```js
npx node -v // 执行某个模块
npx node@0.12.8 -v // 执行某个版本的模块
npx -p lolcatjs -p cowsay -c 'cowsay hello | lolcatjs' // -p 指定下载的模块; -c 内部放执行命令

npx --no-install cowsay hello // 只在本地找，找不到就报错
npx --ignore-existing cowsay hello // 忽略本地，下载再使用
```

### nrm
nrm 用来切换源
```js
npm install -g nrm
```

##### 普通方式操作源
```js
npm config get registry // 查看当前源
npm config set registry https://registry.npm.taobao.org/
```

#### nrm 操作源
```js
nrm ls // 列出可选择的源
nrm use npm // 切换源
nrm add <自定义源名称> <源地址> // 新增源
nrm del <源名称> // 删除源

nrm test // 测试所有源的速度
nrm test npm // 测试某个源的速度
```

### 依赖冲突
npm 会按 package.json 的依赖顺序将包安装在 node_modules 的第一层，如果遇到版本一样的包的则不再安装，如果遇到版本不一致，则后面的包会安装在对应依赖包的 node_modules 下。


### nvm
切换 node 版本

##### 安装步骤
```js
cd ~
ls -a
touch ~/.bash_profile // 没有该文件则新建一个
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

// 如果没有在 .bash_profile 中加入如下内容，则加入
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

source ~/.bash_profile // 重启使文件生效
```

##### 使用方式
```js
nvm list // 系统安装的 node 版本列表
nvm version // 当前 node 版本
nvm install <version>  // 安装特定版本的 node
nvm use	
```