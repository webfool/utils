const PENDING = Symbol("pending")
const REJECTED = Symbol("rejected")
const RESOLVED = Symbol("resolved")

// promise：有一个主事件，后面的事件按顺序执行
/**
 * 思路：
 * 实例：resolve、reject、回调队列、异步
 * then：返回 promise 且状态由值决定、添加回调队列或执行，值穿透
 */
class MyPromise {
  constructor (executor) {
    this.state = PENDING
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (val) => {
      if (this.state !== PENDING) return

      if (val instanceof MyPromise) {
        val.then(resolve, reject)
      } else {
        setTimeout(() => {
          this.state = RESOLVED
          this.data = val
  
          this.onResolvedCallbacks.forEach(cb => cb(val))
        })
      }
    }

    const reject = (reason) => {
      if (this.state !== PENDING) return
      setTimeout(() => {
        this.state = REJECTED
        this.data = reason
  
        this.onRejectedCallbacks.forEach(cb => cb(reason))
      })
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  // 由promise状态是否完成决定是直接执行回调，还是插入队列
  // 由回调的「返回值」或「回调执行是否报错」决定新 promise 的状态
  then (onResolved, onRejected) {
    const {state, data} = this
    onResolved = typeof onResolved === 'function' ? onResolved : function (val) {return val}
    onRejected = typeof onRejected === 'function' ? onRejected : function (val) {throw val}

    let promise2
    promise2 = new MyPromise((resolve, reject) => {
      if (state === PENDING) {
        this.onResolvedCallbacks.push(function (val) {
          try {
            let x = onResolved(val)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(function (val) {
          try {
            let x = onRejected(val)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      } else {
        setTimeout(() => {
          try {
            let x
            if (state === RESOLVED) {
              x = onResolved(data)
            }
        
            if (state === REJECTED) {
              x = onRejected(data)
            }
      
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })

    return promise2
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  /**
   * 
   * @param {回调函数} callback：可能是异步（返回promise）或同步
   */
  finally (callback) {
    return this.then(
      data => MyPromise.resolve(callback()).then(() => data, () => data),
      reason => MyPromise.resolve(callback()).then(() => {throw reason}, () => {throw reason})
    )
  }
}

/**
 * 由返回值决定promise的状态
 * 思路：（递归）
 * 1、值为 promise，由该 promise 的状态决定
 * 2、值为含有 then 方法（即函数）的对象或函数，将该函数当Promise对象调用，再由其返回值决定 promise
 * 3、其它直接 resolve
 */
function resolvePromise (promise, x, resolve, reject) {
  if (promise === x) return reject(new TypeError('链式循环引用 promise!'))

  if (x instanceof MyPromise) {
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject)
    }, function (reason) {
      reject(reason)
    })
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    let isResolveOrRejectCalled = false

    try {
      then = x.then
      if (typeof then === 'function') {
        then.call(x, function (y) {
          if (isResolveOrRejectCalled) return
          isResolveOrRejectCalled = true
          resolvePromise(promise, y, resolve, reject)
        }, function (reason) {
          if (isResolveOrRejectCalled) return
          isResolveOrRejectCalled = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (isResolveOrRejectCalled) return
        isResolveOrRejectCalled = true
        reject(e)
    }
    
  } else {
    resolve(x)
  }
}

MyPromise.all = function (list) {
  return new MyPromise((resolve, reject) => {
    let count = 0
    let result = []

    list.forEach((item, index) => {
      MyPromise.resolve(item).then(val => {
        count++
        result[index] = val

        if (count === list.length) {
          resolve(result)
        }
      }, reason => reject(reason))
    })
  })
}

MyPromise.race = function (list) {
  return new MyPromise((resolve, reject) => {
    list.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}

MyPromise.defer = MyPromise.deferred = function () {
  var dfd = {}
  dfd.promise = new MyPromise(function (resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = MyPromise