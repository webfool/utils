function ajaxJSONP (options) {
  let _callbackName = options.jsonpCallback
  let  callbackName = typeof _callbackName === 'function' ? _callbackName() : _callbackName
  let originalCallback = window[callbackName]

  // === 主线：生成 script -> 赋值 script.src -> script 插入head ===
  // 监听 script 的 load、error 事件，在所有回调执行完之后，才真正执行 callback
  // 发送前的校验不通过、发送超时，都会触发 script 的 error 事件
  let script = document.createElement('script')
  let responseData

  let abort = function (errorType) { // 发送前的校验不通过、发送超时，会通过该方法去触发 script 的 error 回调
    $(script).triggerHandler('error', errorType || 'abort')
  }
  let xhr = { abort: abort }
  let abortTimeout

  $(script).on('load error', function (e, errorType) {
    clearTimeout(abortTimeout)
    $(script).off().remove()

    // 先执行成功/失败回调
    if (e.type == 'error' || !responseData) {
      ajaxError(null, errorType || 'error', xhr, options, deferred)
    } else {
      ajaxSuccess(responseData[0], xhr, options, deferred)
    }

    // 再执行 callback
    window[callbackName] = originalCallback
    if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0])

    // 清除闭包
    originalCallback = responseData = undefined
  })

  // 请求前的拦截
  if (ajaxBeforeSend(xhr, options) === false) {
    abort('abort')
    return xhr
  }

  // 重写原方法，避免请求回来立即执行了回调
  window[callbackName] = function () {
    responseData = arguments
  }

  script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
  document.head.appendChild(script)

  // 超时处理
  if (options.timeout > 0) abortTimeout = setTimeout(function () {
    abort('timeout')
  }, options.timeout)

  return xhr
}
