let tree = {
  value: 0,
  children: [
    {
      value: 11,
      children: [{
        value: 21,
        children: [{
          value: 31,
          children: []
        }, {
          value: 32,
          children: []
        }, {
          value: 33,
          children: []
        }]
      }, {
        value: 22,
        children: []
      }]
    },
    {
      value: 12,
      children: [{
        value: 23,
        children: []
      }, {
        value: 24,
        children: []
      }]
    },
    {
      value: 13,
      children: []
    }
  ]
}

// 递归深度优先
function deepTraversal (treeData, result) {
  result.push(treeData.value)

  if (treeData.children && treeData.children.length) {
    treeData.children.forEach(childTree => {
      deepTraversal(childTree, result)
    })
  }

  return result
}
// console.log('deepTraversal ->', deepTraversal(tree, []))

// 非递归深度优先
function deepTraversal2 (treeData) {
  let result = []
  let stack = [treeData]

  while (stack.length) {
    let item = stack.shift()
    result.push(item.value)
    if (item.children) stack.unshift(...item.children)
  }

  return result
}

// console.log('deepTraversal2 ->', deepTraversal2(tree))

// 非递归广度优先（√）
function breadthTraversal (tree) {
  let result = []
  let stack = [tree]
  let index = 0

  while (index < stack.length) {
    const item = stack[index]

    result.push(item.value)
    
    if (item.children && item.children.length) {
      stack.push(...item.children)
    }

    index++
  }

  return result
}

// console.log('breadthTraversal ->', breadthTraversal(tree))

const PENDING = Symbol("pending")
const REJECTED = Symbol("rejected")
const RESOLVED = Symbol("resolved")

// promise
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
  
          this.onRejectedCallbacks.forEach(cb => cb(val))
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

  then = (onResolved, onRejected) => {
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
      }

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
    })

    return promise2
  }
}

function resolvePromise (promise, x, resolve, reject) {
  if (promise === x) return reject(new TypeError('Chaining cycle detected for promise!'))

  if (x instanceof MyPromise) {
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject)
    }, function (reason) {
      reject(reason)
    })
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then = x.then
    let isResolveOrRejectCalled = false

    if (typeof then === 'function') {
      try {
        then.call(x, function (y) {
          if (isResolveOrRejectCalled) return
          resolvePromise(promise, y, resolve, reject)
        }, function (reason) {
          if (isResolveOrRejectCalled) return
          reject(reason)
        })
      } catch (e) {
        if (isResolveOrRejectCalled) return
  
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}


class A {
  constructor () {
    this.name = 'hw'
    let test = () => {
      console.log('this ->', this)
    }

    test()
  }
}

new A()