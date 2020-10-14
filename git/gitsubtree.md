### git subtree
#### 总结
- add/pull时，克隆和合并
- push 时，遍历、生成、关联


#### 新增子仓库
```js
// 先为子仓库地址设置别名
git remote add sub https://github.com/webfool/subtreeTest.git

// 将 common 仓库的 master 分支拉取到 src/common 下
git subtree add --prefix=src/sub sub master
```

##### add 子仓库的步骤
在父仓库中新增子仓库时，会做2件事，总共产生2条 commit：
- 将子仓库的最新 commit 克隆一份到本地 （参见下图commit: 751fce710dc379b80ed228b48912a9243a445d81）

```js
// 此处的备注说明和 pull 有点区别
// pull 下形如：Squashed 'src/sub/' changes from f5e44e4..d89d3dc
Squashed 'src/sub/' content from commit f5e44e4

// 子仓库目录
git-subtree-dir: src/sub
// 子仓库的最后一个 commit 的 SHA-1
git-subtree-split: f5e44e429ab848d2632140c907b74dc4e3252f7e
```
- 将克隆子仓库的 commit 与父仓库进行合并 (参见下图commit: 0697de9003565226377227d62fbcc3b714277b44)

##### add 的 commit 记录变化
```js
*    commit 0697de9003565226377227d62fbcc3b714277b44
|\   Merge: 91375c9 751fce7
| |  Author: HaoWenLiu <370092760@qq.com>
| |  Date:   Mon Jun 29 17:58:09 2020 +0800
| |   
| |       Merge commit '751fce710dc379b80ed228b48912a9243a445d81' as 'src/sub'
| | 
| * commit 751fce710dc379b80ed228b48912a9243a445d81
|   Author: HaoWenLiu <370092760@qq.com>
|   Date:   Mon Jun 29 17:58:09 2020 +0800
|   
|       Squashed 'src/sub/' content from commit f5e44e4
|       
|       git-subtree-dir: src/sub
|       git-subtree-split: f5e44e429ab848d2632140c907b74dc4e3252f7e
| 
* commit 91375c978d5d5754aeb056ef920a8dad3e9b2337
| Author: HaoWenLiu <370092760@qq.com>
| Date:   Mon Jun 29 11:20:03 2020 +0800
| 
|     del src/sub
| 
* commit 4a5a71540bdc93e62e2ec6fa4ade9a030b67c72d
  Author: HaoWenLiu <370092760@qq.com>
  Date:   Mon Jun 29 11:18:35 2020 +0800
  
      typeorm repo init
```

#### 拉取子仓库
```js
git subtree pull --prefix=src/sub sub master
```

##### pull 子仓库的步骤
git subtree 拉取子仓库时，会做4件事情：
- 根据搜索历史记录中克隆的子仓库 commit 的备注中是否存在子仓库最新 commit 的 SHA-1 值，判断是否已经被拉取过
- 克隆一份子仓库最新的 commit 到本地
```js
// 此处的备注与 add 的存在差异
Squashed 'src/sub/' changes from f5e44e4..d89d3dc

// 距离上次拉取经历过的子仓库 commit
d89d3dc sub: change 2
c4c32c1 Merge commit '751fce710dc379b80ed228b48912a9243a445d81' as 'src/sub'
91375c9 del src/sub
4a5a715 typeorm repo init

// 子仓库目录
git-subtree-dir: src/sub
// 子仓库的最后一个 commit 的 SHA-1
git-subtree-split: d89d3dc9be5903c2382e8d2d289c0aa71b87c83a
```
- 克隆的 commit 的 parent 指针会指向上一次克隆的 commit。
- 将克隆的子仓库 commit 与父仓库进行 merge

##### add 和 pull 的区别
对比 add，pull 的不同在于：校验、克隆时的备注、添加 parent 指针
##### pull 的 commit 记录变化
```js
*   commit 868781917666c1124cf040bcd3a83c983a5b387e (HEAD -> master)
|\  Merge: 73f2bc1 bf09d86
| | Author: HaoWenLiu <370092760@qq.com>
| | Date:   Mon Jun 29 18:02:22 2020 +0800
| | 
| |     Merge commit 'bf09d869c6c728a5f8ee7152229df8aa0f27fcc7'
| | 
| * commit bf09d869c6c728a5f8ee7152229df8aa0f27fcc7
| | Author: HaoWenLiu <370092760@qq.com>
| | Date:   Mon Jun 29 18:02:22 2020 +0800
| | 
| |     Squashed 'src/sub/' changes from f5e44e4..d89d3dc
| |     
| |     d89d3dc sub: change 2
| |     c4c32c1 Merge commit '751fce710dc379b80ed228b48912a9243a445d81' as 'src/sub'
| |     91375c9 del src/sub
| |     4a5a715 typeorm repo init
| |     
| |     git-subtree-dir: src/sub
| |     git-subtree-split: d89d3dc9be5903c2382e8d2d289c0aa71b87c83a
| | 
* | commit 73f2bc14c85c50279806e70febcd0423979d7154
| | Author: HaoWenLiu <370092760@qq.com>
| | Date:   Mon Jun 29 18:01:57 2020 +0800
| | 
| |     type: change1
| |   
* |   commit 0697de9003565226377227d62fbcc3b714277b44
|\ \  Merge: 91375c9 751fce7
| |/  Author: HaoWenLiu <370092760@qq.com>
| |   Date:   Mon Jun 29 17:58:09 2020 +0800
| |   
| |       Merge commit '751fce710dc379b80ed228b48912a9243a445d81' as 'src/sub'
| | 
| * commit 751fce710dc379b80ed228b48912a9243a445d81
|   Author: HaoWenLiu <370092760@qq.com>
|   Date:   Mon Jun 29 17:58:09 2020 +0800
|   
|       Squashed 'src/sub/' content from commit f5e44e4
|       
|       git-subtree-dir: src/sub
|       git-subtree-split: f5e44e429ab848d2632140c907b74dc4e3252f7e
| 
* commit 91375c978d5d5754aeb056ef920a8dad3e9b2337
| Author: HaoWenLiu <370092760@qq.com>
| Date:   Mon Jun 29 11:20:03 2020 +0800
| 
|     del src/sub
| 
* commit 4a5a71540bdc93e62e2ec6fa4ade9a030b67c72d
  Author: HaoWenLiu <370092760@qq.com>
  Date:   Mon Jun 29 11:18:35 2020 +0800
  
      typeorm repo init
```

#### 推送更新到子仓库
将 src/sub 的内容推送到远程 sub 仓库的 master 分支
```js
git subtree push --prefix src/sub sub master
```

##### push 子仓库的步骤
push 子仓库时会做2件事：
- 遍历所有 commit（包括克隆的子仓库 commit），为每个涉及到子仓库变化的 commit 生成子仓库的 commit
```js
// 推送时，会出现如下提示，代表一共有9个 commit，其中3个涉及到子仓库变化
git push using: sub master
9/    9(6) [3]
```
对于上次 push 生成过子仓库 commit 的父仓库 commit，再次 push 时会使用与之前相同的 commit 值。

- 某个 commit 是基于从子仓库克隆的 commit 和父仓库合并生成的，该 commit 的生成的子仓库 commit 的 parent 将指向子仓库克隆的 commit 的备注中的远程仓库的 SHA-1 值。

##### 存在的问题
由于每次 push 都会遍历每个父仓库 commit，当 commit 多了，速度会很慢。解决办法是采用分割仓库
```js
// 将 src/sub 目录下的内容切割出来，放到 module 分支下，此时 module 分支只有 src/sub 里面的内容（不包括 sub 目录）
// --rejoin 会记录上一次分割时的所有子 commit，再次执行分割时，只会为涉及子仓库变化的新commit 生成子 commit
git subtree split -P src/sub -b 'module' --rejoin

// 分割之后再提交
git push sub module:master
```
