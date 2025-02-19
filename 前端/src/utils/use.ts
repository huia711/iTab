import { onUnmounted, ref } from "vue"

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: string) {
  // 如果在非浏览器环境下运行 (如 SSR)，则返回一个空的 ref 值
  if (!window) return ref(false)

  // 使用 matchMedia 方法创建媒体查询对象
  const mediaQuery = window.matchMedia(query)
  // 初始化一个响应式变量 matches 来保存媒体查询结果
  const matches = ref(mediaQuery.matches)

  // 定义一个 handler 回调函数，用于更新 matches 的值
  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  // 监听媒体查询对象的变化，并在变化时更新 matches 的值
  mediaQuery.addEventListener("change", handler)

  // 在组件卸载时停止监听媒体查询对象的变化
  onUnmounted(() => {
    mediaQuery.removeEventListener("change", handler)
  })

  // 返回 matches 变量，作为响应式的 ref 对象
  return matches
}

export function usePreferredDark() {
  return useMediaQuery("(prefers-color-scheme: dark)")
}
