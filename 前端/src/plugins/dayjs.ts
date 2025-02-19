// 使用了 Day.js 库来管理日期和时间的处理

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime" // 相对时间插件
import "dayjs/locale/zh-cn" // 中文简体语言包
import "dayjs/locale/zh-tw" // 中文繁体语言包
import "dayjs/locale/en" // 英文语言包

dayjs.extend(relativeTime) // 应用相对时间插件
dayjs.locale("zh-cn") // 设置默认语言为中文简体

export default dayjs // 导出 Day.js 对象