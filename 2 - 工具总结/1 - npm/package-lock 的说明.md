为了避免多人协作时，npm install 安装不同版本的依赖，所以通过 package-lock 文件，用于锁定版本。

### 更新依赖版本的两种安装方式：

##### 直接修改 package.json 中的版本信息
如果修改之后，package-lock.json 中的版本信息不满足 package.json，那么会按照 package.json 的版本进行安装，然后更新 package-lock.json。如果满足，则按 package-lock.json 进行安装

##### npm install xxx@3.1.1
直接指定版本，那么会安装指定的版本进行安装，并更新 package-lock.json


##### 两种方式的总结
直接指定版本可以向前或向后改版本，在 package.json 修改版本只能向后改版本