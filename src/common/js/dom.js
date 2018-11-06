// dom操作方法
/**
 * 判断是否存在某个class类名
 * @param {*} el
 * @param {*} className
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 * 添加class类名
 * @param {*} el
 * @param {*} className
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 操作'data-'属性
 * @param {*} el    dom对象
 * @param {*} name  属性'data-'后面的字段，例'data-index',name值为'index'
 * @param {*} val   val值，如果传入val值代表要设置data-属性，不传入代表只获取元素的'data-'属性
 */
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}
