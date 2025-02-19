// 定义了一个基于 Axios 的 HTTP 请求封装模块，用于发送 HTTP 请求

import Axios from "axios"

const axios = Axios.create({
  timeout: 10000 // 超时时间
})

export default axios
