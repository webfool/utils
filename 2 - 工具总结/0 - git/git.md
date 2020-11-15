#### 总结
- commit 提交对象
- 分支
  - merge 合并
    - fast forward
    - recursive
  - rebase 衍合
    - 全部衍合
    - 部分衍合
  - 远程分支

commit 对象是 git 的基础单元，commit 对象组成的链条是网状的。分支即是某个 commit 对象的引用。分支的合并有2种方式：merge 和 rebase。merge 又分为 fast forward 和 recursive。rebase 又分为全部衍合 和 部分衍合。

#### commit 提交对象
指针：即计算的校验和，是一种40个字符长度的 SHA-1 哈希字串
每次 commit 之后，会存在如下3种对象：

commit 对象：
- 本次提交的作者等相关附属元数据信息
- 指向暂存内容快照的指针
- 零个或多个父对象指针（首次提交为0个，多个分支合并有多个祖先）

tree 对象：
- 目录树内容
- 各个文件对应的 blob 对象指针

blob 对象：
- 文件快照内容

##### 单个提交对象图解
![单个提交对象在仓库中的数据结构](https://simg.open-open.com/show/4df6606b0d75fcb6172e2076aa7b582b.png)

##### 多个提交对象的链接关系
![多个提交对象之间的链接关系](https://simg.open-open.com/show/66b084d28897ceac7dca5eb926c7db64.png)

#### 分支
Git 中的分支，本质上仅仅是个指向 commit 对象的可变指针。创建一个分支，即是创建一个文件并存入 commit 对象的校验和（40个字符长度的 SHA-1 字串）再加一个换行符共41个字节，所以创建和销毁分支变得很快。

通过 commit 对象的 parent 索引，分支即可以往回查看历史。

HEAD 特别指针：一个指向你正在工作中的本地分支的指针，想象为当前分支的别名。每次提交后 HEAD 随着分支一起向前移动。

#### 分支合并
合并有两种方式：fast forward 和 recursive。

##### fast forward
如果合并进来的分支是在当前分支的基础上延伸的，在合并的时候只是把当前分支的指针指向被合并分支的最顶部，这种把指针简单右移的方式称为快进 (Fast Forward)。
![](https://simg.open-open.com/show/9e066265e09934672aaf495530a808ca.png)

##### recursive
两个不同的分支在某个 commit 之后分别加入了不同的 commit，此时的合并会用两个分支的末端以及它们的共同祖先进行一次简单的三方合并计算，合并结果重新生成一个新的快照，并自动创建一个指向它的提交对象。新的提交对象比较特殊，它拥有多个祖先，所以通过它可以同时追溯不同分支的记录。

![](https://simg.open-open.com/show/a31c9815f0ee82ca44a55621dbae18c1.png)

这次，Git 没有简单地把分支指针右移，而是对三方合并后的结果重新做一个新的快照，并自动创建一个指向它的提交对象（C6）（见图 3-17）。这个提交对象比较特殊，它有两个祖先（C4 和 C5)
![](https://simg.open-open.com/show/c6fd7aa657516b4b8e0ffdfc9be367b4.png)

#### 分支管理
```js
// 新建分支，但不自动切换
git branch iss53
// 新建分支，且自动切换
git checkout -b iss53

// 查看本地所有分支，分支前的 * 字符：它表示当前所在的分支
git branch
// 查看所有分支，包括远程和本地
git branch -a
// 查看哪些分支已并入当前分支，可以在当前分支找到所有被并入分支的 commit 记录
git branch --merge
// 查看哪些分支未并入当前分支
git branch --no-merged
// 查看不同分支的最新提交信息
git branch -v
```

#### 远程分支
远程分支(remote branch) 记录的是远程仓库对应分支的 commit。它在本地无法被移动，即使是远程仓库更新了，也不会对本地有影响。它只有在 git 进行网络交互时才会更新，如 pull、push。

![](https://simg.open-open.com/show/fbe14399e34aad225e5cf709ab7f43d1.png)

##### 本地分支与远程分支
新建分支，并与远程分支关联
```js
// 追踪远程分支，自动创建与远程分支同名的本地分支
git checkout --track origin/serverfix
// 追踪远程分支，自定义本地分支名
git checkout -b serverfix origin/serverfix
```

删除远程分支
```js
git push origin :serverfix
```

#### 分支的衍合
衍合：把当前分支的 commit 衍生到另一分支最后。

##### 全部衍合(rebase)
A 分支衍合 B 分支，即是将 A、B 共同祖先之后的 A 的所有提交在 B 最后一个提交之后进行衍生合并，即重新走一遍所有提交。

```js
git checkout experiment
git rebase master
```

![](https://simg.open-open.com/show/1af43a2c25493e50f5a0900b37ea139f.png)

##### 部分衍合
> 以 A 为基础，衍合除去 B 的 C。


命令解释：以 master 为基础，衍合除去 server 中的 commit 的 client 分支。
```js
git rebase --onto master server client
```

![](https://simg.open-open.com/show/db9ee00bda592ddf4ead2a5b4a272d7b.png)

##### 衍合相关命令
```js
// 基于 master 分支，衍合当前分支不在 master 上的 commit
git rebase master
// 基于 master 分支，衍合 client 分支不在 master 上的 commit
git rebase master client
// 基于 master 分支，衍合不在 server 分支的但在 client 分支上的 commit
git rebase --onto master server client
```

不应该对已经发布到公共仓库的提交对象进行衍合。因为其他协作者可能已经基于该提交对象进行开发，如果把提交对象再进行衍合，就会造成仓库里存在虽然 SHA-1 校验值不同，但内容相同的提交对象。

使用衍合的前提是，衍合之后，之前的提交对象不会再被其它地方引用。
