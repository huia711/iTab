/**
 * 休眠
 *
 * @param wait 休眠时间
 */
export async function sleep(wait: number) {
  await new Promise(resolve => {
    setTimeout(resolve, wait)
  })
}

export type DebounceFunction<E extends any[]> = (...args: E) => void

/**
 * 防抖执行
 *
 * @param func 执行回调
 * @param wait 延迟时间
 */
export function debounce<E extends any[]>(
  this: any,
  func: DebounceFunction<E>,
  wait = 100
): DebounceFunction<E> {
  let timeId: number

  return (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this

    if (timeId) clearTimeout(timeId)

    timeId = setTimeout(() => {
      Reflect.apply(func, _this, args)
    }, wait)
  }
}
