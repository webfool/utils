class Promise {
  constructor (executor) {
    var self = this

    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    // function resolve(value) {
    //   if (value instanceof Promise) {
    //     return value.then(resolve, reject)
    //   }
    //   setTimeout(function() { // 异步执行所有的回调函数
    //     if (self.status === 'pending') {
    //       self.status = 'resolved'
    //       self.data = value
    //       for (var i = 0; i < self.onResolvedCallback.length; i++) {
    //         self.onResolvedCallback[i](value)
    //       }
    //     }
    //   })
    // }
    const resolve = (val) => {
      if (this.status !== 'pending') return

      if (val instanceof Promise) {
        val.then(resolve, reject)
      } else {
        setTimeout(() => {
          this.status = 'resolved'
          this.data = val
  
          this.onResolvedCallback.forEach(cb => cb(val))
        })
      }
    }

    // function reject(reason) {
    //   setTimeout(function() { // 异步执行所有的回调函数
    //     if (self.status === 'pending') {
    //       self.status = 'rejected'
    //       self.data = reason
    //       for (var i = 0; i < self.onRejectedCallback.length; i++) {
    //         self.onRejectedCallback[i](reason)
    //       }
    //     }
    //   })
    // }

    const reject = (reason) => {
      if (this.status !== 'pending') return
      setTimeout(() => {
        this.status = 'rejected'
        this.data = reason
  
        this.onRejectedCallback.forEach(cb => cb(reason))
      })
    }

    try {
      executor(resolve, reject)
    } catch (reason) {
      reject(reason)
    }
  }

  then (onResolved, onRejected) {
    // var self = this
    const {status, data} = this

    var promise2
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
      return v
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
      throw r
    }
  
    promise2 = new Promise((resolve, reject) => {

      if (status === 'pending') {
        this.onResolvedCallback.push(function (val) {
          try {
            let x = onResolved(val)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallback.push(function (val) {
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
            if (status === 'resolved') {
              x = onResolved(data)
            }
        
            if (status === 'rejected') {
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
    // if (self.status === 'resolved') {
    //   return promise2 = new Promise(function(resolve, reject) {
    //     setTimeout(function() { // 异步执行onResolved
    //       try {
    //         var x = onResolved(self.data)
    //         resolvePromise(promise2, x, resolve, reject)
    //       } catch (reason) {
    //         reject(reason)
    //       }
    //     })
    //   })
    // }
  
    // if (self.status === 'rejected') {
    //   return promise2 = new Promise(function(resolve, reject) {
    //     setTimeout(function() { // 异步执行onRejected
    //       try {
    //         var x = onRejected(self.data)
    //         resolvePromise(promise2, x, resolve, reject)
    //       } catch (reason) {
    //         reject(reason)
    //       }
    //     })
    //   })
    // }
  
    // if (self.status === 'pending') {
    //   // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
    //   return promise2 = new Promise(function(resolve, reject) {
    //     self.onResolvedCallback.push(function(value) {
    //       try {
    //         var x = onResolved(value)
    //         resolvePromise(promise2, x, resolve, reject)
    //       } catch (r) {
    //         reject(r)
    //       }
    //     })
  
    //     self.onRejectedCallback.push(function(reason) {
    //         try {
    //           var x = onRejected(reason)
    //           resolvePromise(promise2, x, resolve, reject)
    //         } catch (r) {
    //           reject(r)
    //         }
    //       })
    //   })
    // }
  }
  
  catch (onRejected) {
    return this.then(null, onRejected)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  var then
  var thenCalledOrThrow = false

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  if (x instanceof Promise) {
    // if (x.status === 'pending') { //because x could resolved by a Promise Object
    //   x.then(function(v) {
    //     resolvePromise(promise2, v, resolve, reject)
    //   }, reject)
    // } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
    //   x.then(resolve, reject)
    // }
    // return
    x.then(function (y) {
      resolvePromise(promise2, y, resolve, reject)
    }, function (reason) {
      reject(reason)
    })
    return
  }

  

  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then //because x.then could be a getter
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise