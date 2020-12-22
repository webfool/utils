################
# 变量和函数相关
################

# MY_VAR="default val" # 变量的定义
# echo $MY_VAR         # 变量的使用方式1
# echo ${MY_VAR}       # 变量的使用方式2

# MY_FUNC() {          # 函数的定义
#   local INNER_VAR    # 函数内部通过 local 顶部局部变量
#   echo 'in func'

#   # $n 代表出给函数的第n个参数
#   echo $1
# }
# MY_FUNC 'abc'        # 函数的执行和传参 

################
# 路径相关
################

# echo $(pwd)          # 获取发起shell脚本执行的目录
# echo $0              # 相对于 pwd 的当前文件路径
# dirname $(pwd)       # 获取某个路径的目录路径
# basename $(pwd)      # 获取某个路径的最后一节的路径
# cd ..; echo $(pwd)   # shell 脚本内执行路径命令时，pwd 会相应改变

################
# 参数相关
################

# echo $#              # 获取给 shell 传参的总个数
# echo $@              # 获取所有传参
# echo $1 $2           # $n 获取第n个传参，$1 代表第一个

### 遍历获取命令行传参
# USER="defautl_user"
# PASSWORD="default_password"
# while getopts ":u:p:" opt; do
#   case $opt in
#     u)
#       USER=$OPTARG
#       ;; # case 条件语句结束符
#     p)
#       PASSWORD=$OPTARG
#       ;;
#     ?)
#       echo 'unknow input'
#       exit 1 # 该命令用来退出程序执行
#       ;;
#   esac
# done

# while [ $# != 0 ]
# do
#   echo 'prama is '$1', prama size is ' $#
#   shift               # shift 用于销毁一个参数，后面的参数前移
# done

# echo $USER 
# echo $PASSWORD
# echo ${USER}

################
# 逻辑处理相关
################
# echo $?                   # 获取最后一次命令的执行结果，成功则为0，失败则为1

# a=1
# if [ ! -f "a.js" ]; then  # if elif
#   touch "a.js";
#   echo "var a = 1" > a.js
# elif [ $a -le 2 ]; then
#   echo 'equal'
# fi


################
# 其它
################
# echo $(pwd)                # 命令里执行其它命令的方式1
# echo `pwd`                 # 命令里执行其它命令的方式2

# . ./test2.sh               # 引入其它 sh 文件，这样可以使用其它文件中的函数
# MY_FUNC2
