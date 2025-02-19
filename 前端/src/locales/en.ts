// lang: "English"

export default {
  lang: "English",
  common: {
    auto: "Auto",
    clean: "Clean",
    experiment: "Experiment"
  },
  home: {
    search: "Search",
    warning: "Warning: The search value cannot be empty",
    MainTab: "Main Tab"
  },
  theme: {
    setting: "Theme Setting",
    mode: "Theme mode"
  },
  search: {
    setting: "Search Setting",
    engine: "Search engine",
    suggestApi: "Suggest api",
    suggestApiTip: "Search suggestions need to request the website interface, opening requires authorization",
    searchRound: "Search box rounded corners",
    newTabOpen: "Open search results in a new tab",
    showEngineIcon: "Show search engine icon above the search box",
    showEngineSelet: "Show search engine drop-down in front of the search box"
  },
  background: {
    setting: "Background Setting",
    wallpaper: {
      setting: "Wallpaper setting",
      none: "None",
      local: "Local",
      bing: "Bing wallpaper",
      upload: "Upload wallpaper"
    },
    blur: "Blur",
    maskOpacity: "Mask opacity",
    wallpaperDark: "Make the wallpaper darker in dark mode"
  },
  layout: {
    setting: "Layout Setting",
    topSiteBar: "Topsite Bar",
    topSiteBarTip: "Topsite Bar data comes from the most recent browsing, opening requires authorization",
    colRow: "Col/Row",
    space: "Space",
    align: {
      text: "Align",
      searchCenter: "Search only center (Default)",
      overallCenter: "Overall center",
    }
  },
  bookmark: {
    setting: "Bookmark Setting",
    BookmarkData: "Bookmark data",
    BookmarkDataTip: "last sync: {0}",
    sync: "Sync",
    iconSize: "Icon size",
    boardSize: "Board size",
    boardColor: "Board color",
    boardOpacity: "Board opacity",
    boardRound: "Board round",
    add: "Add site",
    siteTitle: "Site title",
    siteURL: "Site URL",
    autoGet: "Automatically get icon",
    OK: "OK",
    cancel: "Cancel",
    textIcon: "Text icon",
    iconURL:"Icon URL",
  },
  other: {
    setting: "Other Setting",
    lang: "Language",
    searchPlus: "Search enhancement",
    backup: {
      text: "Backup setting",
      export: "Export setting",
      import: "Import setting"
    }
  },
  about: {
    text: "About",
    projectHome: "Project Home",
    changelog: "Changelog",
    feedback: "Feedback",
    license: "Released under the MIT License"
  },
  popup: {
    bookmark: "Bookmark",
    searchHistory: "SearchHistory"
  },
  elDialog: {
    messages:{
      warningTitle: "Warning",
      deleteSuccess: "Delete successfully",
      deleteWarning: "Are you sure to delete this account?(It would dispear permanently)",
    },
    errorMessages:{
      title: "ERROR",
      errorTypes:{
        uploadFailure: "Upload failed:",
        fetchFailure: "Fetch failed:",
        deleteFailure: "Delete failed:",
        notLogined: "Account not logined!",
        noImageClipped: "Please select an area to clip!",
        noCanvas: "Cannot process image!",
        blankName: "New name cannot be blank!",
        repeatName: "New name already exists!",
        blankOldPassword: "Current password cannot be blank!",
        blankNewPassword: "New password cannot be blank!",
        wrongPassword: "Wrong current password!",
        passwordNotEqual: "Passwords are not the same!"
      }
    },
    buttons:{
      confirm: "Ok",
      cancle: "No"
    }
  },
  loginPage: {
    login:"Login",
    register: "Register",
    account: "Account:",
    password: "Password:",
    userName: "Name:",
    confirmPassword: "Confirm again:",
    warnings:{
      loginNotComplete: "Complete the account and password",
      registerNotComplete: "Complete user name and password",
      serverUnreachable: "Server unreachable",
      passwordNotEqual: "Passwords are not the same"
    }
  },
  userPage:{
    username: "Name:",
    password: "Password:······",
    logout: "Logout",
    deleteAccount: "Delete Account",
    imageClip:{
        clipWindow: "Clip 4 Avatar",
        upload: "Upload",
        preview: "Preview",
        close: "Close"
    },
    editName:{
        edit: "New name:",
        confirm: "Confirm",
        cancle: "Cancle"
    },
    editPassword:{
        oldPassword: "Current password:",
        newPassword: "New password:",
        confirmPassword: "Confirm again:",
        confirm: "Confirm",
        cancle: "Cancle"
    }
},
  settingPage: {
    common: {
      title: "Common",
      settings: {
        theme:{
          title: "Theme",
          customizedBackgroundColor: "Customized Background Color",
          customizedButtonColor: "Customized Button Color",
          fontColor: "Font Color:",
          presetColor: "Preset Theme",
          preview: "Preview",
          dayMode: "Day Mode",
          nightMode: "Night Mode"
        },
        lang: {
          title: "Language"
        }
      }
    },
    wallpaper: {
      title: "Wallpaper",
      reload: "Reload",
      webImages: "Preset",
      uploadImages: {
        title: "Custom",
        tips: "Click here and choose a file to upload",
        links: "You can also enter the image link here"
      },
      confirm: "Confirm"
    },
    advance: {
      title: "Advance",
      maxSearchCount: "Maximun Search Results",
    },
    about: {
      title: "About",
      author: "软件中级实训制作组",
      rights: "2023 All rights reserved",
    }
  }
};
