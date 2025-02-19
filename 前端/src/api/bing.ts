// 获取必应搜索每日壁纸链接的函数

// 导入所需模块和函数
import axios from "@/plugins/axios"

// 设置必应搜索的基础 URL 地址
const BASE_URL = "https://cn.bing.com"

/**
 * 使用 GET 请求获取必应每日壁纸的链接
 * @param {number} n 图片数量，默认为 1
 * @returns {Promise<string|null>} 图片地址的 Promise 对象
 * - format：表示响应格式，这里是 js。
 * - idx：返回的图片序列号，默认为 0。
 * - n：返回的图片数量，默认为 1。
 * - mkt：壁纸的地理区域，这里是中国大陆 zh-CN。
 */
export async function getDailyWallpaperUrl(n = 1) {
  // 发起 GET 请求，获取必应搜索返回的 JSON 数据
  const { data } = await axios.get<any>("/HPImageArchive.aspx", {
    baseURL: BASE_URL,
    params: {
      format: "js",
      idx: 0,
      n,
      mkt: "zh-CN"
    }
  })

  // 获取第一张图片的数据
  const imageData = data.images && data.images[0]

  // 如果图片数据为空，则返回 null，否则返回图片地址
  return imageData.length === 0 ? null : BASE_URL + imageData.url
}
