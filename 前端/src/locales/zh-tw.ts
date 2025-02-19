// lang: "zh-tw"

export default {
  lang: "繁體中文",
  common: {
    auto: "自動",
    clean: "清空",
    experiment: "试验"
  },
  home: {
    search: "搜索",
    warning: "警告：搜尋值不能為空",
    MainTab: "主頁面"
  },
  theme: {
    setting: "主題設置",
    mode: "主題模式"
  },
  search: {
    setting: "搜索設置",
    engine: "搜索引擎",
    suggestApi: "搜索建議接口",
    suggestApiTip: "搜索建議需請求網站接口，開啟需要授權",
    searchRound: "搜索框圓角",
    newTabOpen: "在新標簽頁中打開搜索結果",
    showEngineIcon: "在搜索框上方顯示搜索引擎圖標",
    showEngineSelet: "在搜索框前添加搜索引擎下拉列表"
  },
  background: {
    setting: "背景設置",
    wallpaper: {
      setting: "壁紙設置",
      none: "無",
      local: "本地圖片",
      bing: "Bing每日壁紙",
      upload: "上傳壁紙"
    },
    blur: "模糊強度",
    maskOpacity: "遮罩不透明度",
    wallpaperDark: "在深色模式下使壁紙更暗"
  },
  layout: {
    setting: "布局設置",
    topSiteBar: "導航欄",
    topSiteBarTip: "導航欄數據來源於最近瀏覽，開啟需要授權",
    colRow: "行/列數",
    space: "間距",
    align: {
      text: "對齊",
      searchCenter: "僅搜索居中 (默認)",
      overallCenter: "整體居中"
    }
  },
  bookmark: {
    setting: "導航欄設置",
    BookmarkData: "最近瀏覽數據",
    BookmarkDataTip: "最近同步: {0}",
    sync: "同步",
    iconSize: "圖標大小",
    boardSize: "底板大小",
    boardColor: "底板顏色",
    boardOpacity: "底板不透明度",
    boardRound: "底板圓角",
    add: "添加導航",
    siteTitle: "網站標題",
    siteURL: "網站URL",
    autoGet: "自動獲取圖標",
    OK: "確定",
    cancel: "取消",
    textIcon: "文字圖示",
    iconURL:"圖示URL",
  },
  other: {
    setting: "其他設置",
    lang: "語言",
    searchPlus: "搜索增强",
    backup: {
      text: "備份設置",
      export: "導出設置",
      import: "導入設置"
    }
  },
  about: {
    text: "關於",
    projectHome: "項目地址",
    changelog: "更新日誌",
    feedback: "問題反饋",
    license: "遵循 MIT 開源協議"
  },
  popup: {
    bookmark: "首頁導航",
    searchHistory: "搜索歷史"
  },
  elDialog: {
    messages:{
      warningTitle: "警告",
      deleteSuccess: "刪除成功",
      deleteWarning: "確認刪除賬號？（賬號將永久消失！）",
    },
    errorMessages:{
      title: "錯誤",
      errorTypes:{
        uploadFailure: "上傳失敗:",
        fetchFailure: "獲取失敗:",
        deleteFailure: "刪除失敗:",
        notLogined: "賬號未登錄！",
        noImageClipped: "請選擇截圖區域！",
        noCanvas: "無法處理圖片！",
        blankName: "新暱稱不能為空！",
        repeatName: "新暱稱不能與原名相同！",
        blankOldPassword: "原密碼不能為空！",
        blankNewPassword: "新密碼不不能為空！",
        wrongPassword: "原密碼錯誤！",
        passwordNotEqual: "兩次輸入的密碼不一致！"
      }
    },
    buttons:{
      confirm: "確定",
      cancle: "取消"
    }
  },
  loginPage: {
    login:"登 錄",
    register: "註 冊",
    account: "賬號：",
    password: "密碼：",
    userName: "暱稱：",
    confirmPassword: "確認密碼：",
    warnings:{
      loginNotComplete: "賬號或密碼不能為空",
      registerNotComplete: "用戶暱稱與密碼不能為空",
      serverUnreachable: "無法連接服務器",
      passwordNotEqual: "兩次輸入的密碼不一致"
    }
  },
  settingPage: {
    common: {
      title: "通用",
      settings: {
        theme:{
          title: "主題顏色",
          customizedBackgroundColor: "自定義背景顏色",
          customizedButtonColor: "自定義按鈕顏色",
          fontColor: "字體顏色:",
          presetColor: "預設背景顏色",
          preview: "預覽",
          dayMode: "白天模式",
          nightMode: "夜間模式"
        },
        lang: {
          title: "語言設置"
        }
      }
    },
    wallpaper: {
      title: "壁紙",
      reload: "重新加載",
      webImages: "網絡圖片",
      uploadImages: {
        title: "上傳圖片",
        tips: "點擊選擇本地圖片文件",
        links: "您也可在此輸入圖片鏈接"
      },
      confirm: "確認上傳"
    },
    advance: {
      title: "搜索",
      maxSearchCount: "最大搜索結果數量",
    },
    about: {
      title: "關於",
      author: "軟件中級實訓製作組",
      rights: "2023 版權所有",
    }
  }
};