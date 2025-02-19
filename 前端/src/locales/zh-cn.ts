// lang: "zh-cn"

export default {
    lang: "简体中文",
    common: {
        auto: "自动",
        clean: "清空",
        experiment: "试验"
    },
    home: {
        search: "搜索",
        warning: "警告:搜索值不能为空",
        MainTab: "主页面"
    },
    theme: {
        setting: "主题设置",
        mode: "主题模式"
    },
    search: {
        setting: "搜索设置",
        engine: "搜索引擎",
        suggestApi: "搜索建议接口",
        suggestApiTip: "搜索建议需请求网站接口，开启需要授权",
        searchRound: "搜索框圆角",
        newTabOpen: "在新标签页中打开搜索结果",
        showEngineIcon: "在搜索框上方显示搜索引擎图标",
        showEngineSelet: "在搜索框前添加搜索引擎下拉列表"
    },
    background: {
        setting: "背景设置",
        wallpaper: {
            setting: "壁纸设置",
            none: "无",
            local: "本地图片",
            bing: "Bing每日壁纸",
            upload: "上传壁纸"
        },
        blur: "模糊强度",
        maskOpacity: "遮罩不透明度",
        wallpaperDark: "在深色模式下使壁纸更暗"
    },
    layout: {
        setting: "布局设置",
        topSiteBar: "导航栏",
        topSiteBarTip: "导航栏数据来源于最近浏览，开启需要授权",
        colRow: "行/列数",
        space: "间距",
        align: {
            text: "对齐",
            searchCenter: "仅搜索居中 (默认)",
            overallCenter: "整体居中"
        }
    },
    bookmark: {
        setting: "导航栏设置",
        BookmarkData: "最近浏览数据",
        BookmarkDataTip: "最近同步: {0}",
        sync: "同步",
        iconSize: "图标大小",
        boardSize: "底板大小",
        boardColor: "底板颜色",
        boardOpacity: "底板不透明度",
        boardRound: "底板圆角",
        add: "添加导航",
        siteTitle: "网站标题",
        siteURL: "网站URL",
        autoGet: "自动获取图标",
        OK: "确定",
        cancel: "取消",
        textIcon: "文字图标",
        iconURL:"图标URL",

    },
    other: {
        setting: "其他设置",
        lang: "语言",
        searchPlus: "搜索增强",
        backup: {
            text: "备份配置",
            export: "导出配置",
            import: "导入配置"
        }
    },
    about: {
        text: "关于",
        projectHome: "项目地址",
        changelog: "更新日志",
        feedback: "问题反馈",
        license: "遵循 MIT 开源协议"
    },
    popup: {
        bookmark: "首页导航",
        searchHistory: "搜索历史"
    },
    elDialog: {
        messages:{
            warningTitle: "警告",
            deleteSuccess: "删除成功",
            deleteWarning: "确认删除账号？（账号将永久消失！）",
        },
        errorMessages:{
            title: "错误",
            errorTypes:{
                uploadFailure: "上传失败:",
                fetchFailure: "获取失败:",
                deleteFailure: "删除失败:",
                notLogined: "账号未登录！",
                noImageClipped: "请选择截图区域！",
                noCanvas: "无法处理图片！",
                blankName: "新昵称不能为空！",
                repeatName: "新昵称不能与原名相同！",
                blankOldPassword: "原密码不能为空！",
                blankNewPassword: "新密码不能为空！",
                wrongPassword: "原密码错误！",
                passwordNotEqual: "两次输入的密码不一致！"
            }
        },
        buttons:{
            confirm: "确定",
            cancle: "取消"
        }
    },
    loginPage: {
        login:"登 录",
        register: "注 册",
        account: "账号：",
        password: "密码：",
        userName: "昵称：",
        confirmPassword: "确认密码：",
        warnings:{
            loginNotComplete: "账号或密码不能为空",
            registerNotComplete: "用户昵称与密码不能为空",
            serverUnreachable: "无法连接服务器",
            passwordNotEqual: "两次输入的密码不一致"
        }
    },
    userPage:{
        username: "用户名：",
        password: "密码：······",
        logout: "退出登录",
        deleteAccount: "删除账号",
        imageClip:{
            clipWindow: "截取头像",
            upload: "上传图片",
            preview: "预览",
            close: "关闭"
        },
        editName:{
            edit: "修改昵称：",
            confirm: "确认修改",
            cancle: "取消"
        },
        editPassword:{
            oldPassword: "旧密码：",
            newPassword: "新密码：",
            confirmPassword: "确认密码：",
            confirm: "确认修改",
            cancle: "取消"
        }
    },
    settingPage: {
        common: {
            title: "通用",
            settings: {
                theme:{
                    title: "主题颜色",
                    customizedBackgroundColor: "自定义背景颜色",
                    customizedButtonColor: "自定义按钮颜色",
                    fontColor: "字体颜色:",
                    presetColor: "预设主题颜色",
                    preview: "预览",
                    dayMode: "白天模式",
                    nightMode: "夜间模式"
                },
                lang: {
                    title: "语言设置"
                }
            }
        },
        wallpaper: {
            title: "壁纸",
            reload: "重新加载",
            webImages: "网络图片",
            uploadImages: {
                title: "上传图片",
                tips: "点击选择本地图片文件",
                links: "您也可在此输入图片链接"
            },
            confirm: "确认上传"
        },
        advance: {
            title: "搜索",
            maxSearchCount: "最大搜索结果数量",
        },
        about: {
            title: "关于",
            author: "软件中级实训制作组",
            rights: "2023 版权所有",
        }
    }
};

