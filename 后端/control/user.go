package control

import (
	"backend/models"
	"backend/mysql"
	"backend/response"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/bwmarrin/snowflake"
	"github.com/gin-gonic/gin"
	"golang.org/x/text/encoding/simplifiedchinese"
	"golang.org/x/text/transform"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
)

// 注册
func RegisterHandler(c *gin.Context) {
	var userRegister *models.RegisterForm
	node, err := snowflake.NewNode(1)
	if err != nil {
		panic(err)
	}
	if err := c.ShouldBind(&userRegister); err != nil {
		response.Fail(c, nil, "注册失败!")
	} else {
		//判断用户名是否存在
		var findUser models.User
		result := mysql.DB.Where("user_name=?", userRegister.UserName).First(&findUser)
		if result.Error == nil {
			response.Fail(c, nil, "用户名已被使用!")
		} else if result.Error != nil {
			var newUser = models.User{
				Id:                    strconv.FormatUint(uint64(node.Generate().Int64()%10000000000), 10),
				Password:              userRegister.Password,
				UserName:              userRegister.UserName,
				Url:                   "https://baidu.com/",
				HeadUrl:               "http://localhost:2020/user/1",
				BackgroundURL:         "http://localhost:2020/user/1",
				ButtonColor:           "#ffffff",
				BackgroundColor:       "#ffffff",
				CustomButtonColor:     false,
				CustomBackgroundColor: false,
				FontColor:             "black",
				PresetColor:           0,
				BackgroundAlpha:       0.8,
				ButtonAlpha:           0.8,
				SearchEngine:          "Baidu",
				SuggestApi:            "Baidu",
				OpenNewPage:           "true",
				ShowEngineIcon:        "true",
				ShowEngineList:        "true",
				Language:              "Auto",
				SearchItemCount:       0,
				Log:                   "",
			}
			mysql.DB.Create(&newUser)
			response.Success(c, gin.H{"id": newUser.Id}, "注册成功!")
		}
	}
}

// 登录
func LoginHandler(c *gin.Context) {
	var userLogin *models.LoginForm
	if err := c.ShouldBind(&userLogin); err != nil {
		response.Fail(c, nil, "登录失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", userLogin.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			// 查找密码
			if findUser.Password != userLogin.Password {
				response.Fail(c, nil, "密码错误!")
			} else {
				findUser.Url = strings.Replace(findUser.Url, "{\"url\": \"", "", -1)
				findUser.Url = strings.Replace(findUser.Url, "\"}", "", -1)
				Log := strings.Split(findUser.Log, "@#$%")
				Date := strings.Split(findUser.Date, "@#$%")
				response.Success(c, gin.H{
					"userName":              findUser.UserName,
					"backgroundColor":       findUser.BackgroundColor,
					"backgroundAlpha":       findUser.BackgroundAlpha,
					"buttonColor":           findUser.ButtonColor,
					"buttonAlpha":           findUser.ButtonAlpha,
					"customBackgroundColor": findUser.CustomBackgroundColor,
					"customButtonColor":     findUser.CustomButtonColor,
					"presetColor":           findUser.PresetColor,
					"fontColor":             findUser.FontColor,
					"avatar":                findUser.HeadUrl,
					"backgroundURL":         findUser.BackgroundURL,
					"url":                   findUser.Url,
					"title":                 findUser.Title,
					"icon":                  findUser.Icon,
					"textIcon":              findUser.TextIcon,
					"custom":                findUser.Custom,
					"page":                  findUser.Page,
					"record":                findUser.Record,
					"searchEngine":          findUser.SearchEngine,
					"suggestAPI":            findUser.SuggestApi,
					"openNewPage":           findUser.OpenNewPage,
					"showEngineIcon":        findUser.ShowEngineIcon,
					"showEngineList":        findUser.ShowEngineList,
					"language":              findUser.Language,
					"searchItemCount":       findUser.SearchItemCount,
					"log":                   Log,
					"date":                  Date,
				}, "登录成功!")
			}
		}
	}
}

// 获取图片
func WebImages(c *gin.Context) {
	var backGroundURLList []models.PresetBackground
	var imageList string
	var descriptionList string
	var bg models.PresetBackground
	mysql.DB.Where("bgid=?", 1).First(&bg)
	mysql.DB.Select("background_url").Find(&backGroundURLList)
	for _, presetBackGroundURL := range backGroundURLList {
		imageList += presetBackGroundURL.BackgroundURL + ","
	}
	mysql.DB.Select("description").Find(&backGroundURLList)
	for _, presetBackGroundURL := range backGroundURLList {
		descriptionList += presetBackGroundURL.Description + ","
	}
	response.Success(c, gin.H{"url": imageList, "description": descriptionList}, "")
}

// 获取图片
func OnImagesGet(c *gin.Context) {
	imageIndex := c.Param("imageIndex")
	if imageIndex == "7" {
		URL := "resource/" + imageIndex + ".png"
		data, err := ioutil.ReadFile(URL)
		if err != nil {
			c.String(http.StatusInternalServerError, fmt.Sprintf("读取文件出错：%s", err.Error()))
			return
		}
		// 将图片数据编码为 base64 字符串
		imageBase64 := base64.StdEncoding.EncodeToString(data)
		response.Success(c, gin.H{"image": imageBase64}, "200")
	} else {
		URL := "resource/" + imageIndex + ".jpg"
		data, err := ioutil.ReadFile(URL)
		if err != nil {
			c.String(http.StatusInternalServerError, fmt.Sprintf("读取文件出错：%s", err.Error()))
			return
		}
		// 将图片数据编码为 base64 字符串
		imageBase64 := base64.StdEncoding.EncodeToString(data)
		response.Success(c, gin.H{"image": imageBase64}, "200")
	}
}

// 保存设置
func Settings(c *gin.Context) {
	var userSettings *models.SettingForm
	if err := c.ShouldBind(&userSettings); err != nil {
		response.Fail(c, nil, "设置失败")
		fmt.Println("***")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", userSettings.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					ButtonAlpha:           userSettings.ButtonAlpha,
					ButtonColor:           userSettings.ButtonColor,
					BackgroundAlpha:       userSettings.BackgroundAlpha,
					BackgroundColor:       userSettings.BackgroundColor,
					CustomBackgroundColor: userSettings.CustomBackgroundColor,
					CustomButtonColor:     userSettings.CustomButtonColor,
					PresetColor:           userSettings.PresetColor,
					FontColor:             userSettings.FontColor,
					SearchItemCount:       userSettings.SearchItemCount,
					SearchEngine:          userSettings.SearchEngine,
					SuggestApi:            userSettings.SuggestApi,
					OpenNewPage:           userSettings.OpenNewPage,
					ShowEngineIcon:        userSettings.ShowEngineIcon,
					ShowEngineList:        userSettings.ShowEngineList,
					Language:              userSettings.Language,
					BackgroundURL:         userSettings.BackgroundURL,
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "设置失败")
			}
			response.Success(c, gin.H{}, "设置成功!")
		}
	}
}

// 销号
func DeleteAccount(c *gin.Context) {
	var userDelete *models.DeleteForm
	if err := c.ShouldBind(&userDelete); err != nil {
		response.Fail(c, nil, "删除失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", userDelete.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			if err := mysql.DB.Delete(findUser).Error; err != nil {
				response.Fail(c, gin.H{}, "删除失败")
			}
			response.Success(c, gin.H{}, "删除成功!")
		}
	}
}

// 用户上传壁纸
func UploadBackground(c *gin.Context) {
	var uploadBackgroundForm *models.UploadImageForm
	node, err := snowflake.NewNode(1)
	if err != nil {
		panic(err)
	}
	if err := c.ShouldBind(&uploadBackgroundForm); err != nil {
		response.Fail(c, nil, "上传失败")
	} else {
		var findUser models.User
		ran := uint64(node.Generate().Int64() % 10000000000)
		newurl := "resource/" + strconv.FormatUint(ran, 10) + ".jpg"
		newURLOfUser := "http://localhost:2020/user/image/" + strconv.FormatUint(ran, 10)
		// 生成图片
		imageData := strings.ReplaceAll(uploadBackgroundForm.ImageData, "data:image/png;base64,", "")
		imageBytes, err := base64.StdEncoding.DecodeString(imageData)
		if err != nil {
			response.Fail(c, gin.H{"error": "Invalid base64 encoding"}, "上传失败")
		}
		err = os.MkdirAll("image", os.ModePerm)
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to create image directory"}, "上传失败")
		}
		file, err := os.Create(newurl)
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to create image file"}, "上传失败")
		}
		defer file.Close()
		_, err = io.Copy(file, strings.NewReader(string(imageBytes))) // 将字节数组写入文件
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to write image file"}, "上传失败")
		}

		// 更新数据库
		result := mysql.DB.Where("id=?", uploadBackgroundForm.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			err = mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					BackgroundURL: newURLOfUser,
				}).Error
			if err != nil {
				response.Fail(c, gin.H{}, "设置失败")
			} else {
				response.Success(c, gin.H{"URL": newURLOfUser}, "上传成功")
			}
		}
	}
}

// 用户上传头像
func UploadAvatar(c *gin.Context) {
	var uploadAvatarForm *models.UploadImageForm
	node, err := snowflake.NewNode(1)
	if err != nil {
		panic(err)
	}
	if err := c.ShouldBind(&uploadAvatarForm); err != nil {
		response.Fail(c, nil, "上传失败")
	} else {
		var findUser models.User
		ran := uint64(node.Generate().Int64() % 10000000000)
		newurl := "resource/" + strconv.FormatUint(ran, 10) + ".jpg"
		newURLOfUser := "http://localhost:2020/user/image/" + strconv.FormatUint(ran, 10)
		// 生成图片
		imageData := strings.ReplaceAll(uploadAvatarForm.ImageData, "data:image/png;base64,", "")
		imageBytes, err := base64.StdEncoding.DecodeString(imageData)
		if err != nil {
			response.Fail(c, gin.H{"error": "Invalid base64 encoding"}, "上传失败")
		}
		err = os.MkdirAll("image", os.ModePerm)
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to create image directory"}, "上传失败")
		}
		file, err := os.Create(newurl)
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to create image file"}, "上传失败")
		}
		defer file.Close()
		_, err = io.Copy(file, strings.NewReader(string(imageBytes))) // 将字节数组写入文件
		if err != nil {
			response.Fail(c, gin.H{"error": "Failed to write image file"}, "上传失败")
		}

		// 更新数据库
		result := mysql.DB.Where("id=?", uploadAvatarForm.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			err = mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					HeadUrl: newURLOfUser,
				}).Error
			if err != nil {
				response.Fail(c, gin.H{}, "设置失败")
			} else {
				response.Success(c, gin.H{}, "上传成功")
			}
		}
	}
}

// 修改密码
func ChangePasswd(c *gin.Context) {
	var changePwd *models.ChangePasswdForm
	if err := c.ShouldBind(&changePwd); err != nil {
		response.Fail(c, nil, "修改失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", changePwd.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "用户不存在!")
		} else if result.Error == nil {
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					Password: changePwd.NewPwd,
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "修改失败")
			}
			response.Success(c, gin.H{}, "修改成功!")
		}
	}
}

// 修改昵称
func ChangeUserName(c *gin.Context) {
	var changeUserName *models.ChangeUserNameForm
	if err := c.ShouldBind(&changeUserName); err != nil {
		response.Fail(c, nil, "修改失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", changeUserName.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "修改失败")
		} else if result.Error == nil {
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					UserName: changeUserName.NewName,
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "修改失败")
			}
			response.Success(c, gin.H{}, "修改成功!")
		}
	}
}

// 得到当前URL
func GetMyURL(c *gin.Context) {
	userId := c.Param("userId")
	var findUser models.User
	result := mysql.DB.Where("id=?", userId).First(&findUser)
	if result.Error != nil {
		response.Fail(c, nil, "失败")
	} else if result.Error == nil {
		response.Success(c,
			gin.H{
				"url":      findUser.Url,
				"title":    findUser.Title,
				"icon":     findUser.Icon,
				"textIcon": findUser.TextIcon,
				"custom":   findUser.Custom,
			}, "成功!")
	}
}

// 上传新URL
func PostNewURL(c *gin.Context) {
	userId := c.Param("userId")
	var newURLForm []*models.NewURLForm
	if err := c.ShouldBind(&newURLForm); err != nil {
		response.Fail(c, nil, "上传失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", userId).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "修改失败")
		} else if result.Error == nil {
			newURL := ""
			newTitle := ""
			newIcon := ""
			newTextIcon := ""
			newCustom := ""
			newPage := ""
			for _, obj := range newURLForm {
				newURL += obj.Url + " "
				newTitle += obj.Title + " "
				newIcon += obj.Icon + " "
				newTextIcon += obj.TextIcon + " "
				newCustom += obj.Custom + " "
				newPage += obj.Page + " "
			}
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					Url:      newURL,
					Title:    newTitle,
					Icon:     newIcon,
					TextIcon: newTextIcon,
					Custom:   newCustom,
					Page:     newPage,
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "修改失败")
			}
			response.Success(c, gin.H{}, "修改成功!")
		}
	}
}

// 上传搜索记录
func PostRecord(c *gin.Context) {
	userId := c.Param("userId")
	var newRecordForm []*models.NewRecordForm
	if err := c.ShouldBind(&newRecordForm); err != nil {
		response.Fail(c, nil, "上传失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", userId).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "修改失败")
		} else if result.Error == nil {
			newRecord := ""
			for _, obj := range newRecordForm {
				newRecord += obj.Record + " "
			}
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					Record: newRecord,
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "修改失败")
			}
			response.Success(c, gin.H{}, "修改成功!")
		}
	}
}

// 获取百度搜索建议
func GetBaiduSuggestion(c *gin.Context) {
	keyword := c.Query("keyword")

	r, err := http.Get(fmt.Sprintf("http://suggestion.baidu.com/su?wd=%s", keyword))
	if err != nil {
		response.Fail(c, gin.H{}, "失败")
	} else {
		defer r.Body.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.Fail(c, gin.H{}, "失败")
		} else {
			decoder := simplifiedchinese.GBK.NewDecoder()
			jsonStr, _, _ := transform.String(decoder, string(body))
			jsonStr = strings.TrimPrefix(jsonStr, "window.baidu.sug(")
			jsonStr = strings.TrimSuffix(jsonStr, ");")
			jsonStr = strings.ReplaceAll(jsonStr, "{", "{\"")
			jsonStr = strings.ReplaceAll(jsonStr, ":", "\":")
			jsonStr = strings.ReplaceAll(jsonStr, ",p", ",\"p")
			jsonStr = strings.ReplaceAll(jsonStr, ",s", ",\"s")
			var suggestionResponse models.BaiduSuggestionResponse
			if err := json.Unmarshal([]byte(jsonStr), &suggestionResponse); err != nil {
				response.Fail(c, gin.H{}, "失败")
			} else {
				response.Success(c, gin.H{"suggestion": suggestionResponse}, "成功")
			}
		}
	}
}

// 获取必应搜索建议
func GetBingSuggestion(c *gin.Context) {
	keyword := c.Query("keyword")

	r, err := http.Get(fmt.Sprintf("https://api.bing.com/qsonhs.aspx?type=cb&q=%s&cb=window.bing.sug", keyword))
	if err != nil {
		response.Fail(c, gin.H{}, "失败")
	} else {
		defer r.Body.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.Fail(c, gin.H{}, "失败")
		} else {
			jsonStr := strings.TrimPrefix(string(body), "if(typeof window.bing.sug == 'function') window.bing.sug(")
			jsonStr = strings.TrimSuffix(jsonStr, "/* pageview_candidate */);")
			var suggestionResponse models.BingSuggestionResponse
			var sortedSuggestionResponse models.SortedBingSuggestionResponse
			if err := json.Unmarshal([]byte(jsonStr), &suggestionResponse); err != nil {
				response.Fail(c, gin.H{}, "失败")
			} else {
				for _, obj := range suggestionResponse.AS.Results {
					for _, objNext := range obj.Suggests {
						sortedSuggestionResponse.Txt = append(sortedSuggestionResponse.Txt, objNext.Txt)
					}
				}
				response.Success(c, gin.H{"suggestion": sortedSuggestionResponse}, "成功")
			}
		}
	}
}

// 获取谷歌搜索建议
func GetGoogleSuggestion(c *gin.Context) {
	keyword := c.Query("keyword")

	r, err := http.Get(fmt.Sprintf("https://api.bing.com/qsonhs.aspx?type=cb&q=%s&cb=window.bing.sug", keyword))
	if err != nil {
		response.Fail(c, gin.H{}, "失败")
	} else {
		defer r.Body.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.Fail(c, gin.H{}, "失败")
		} else {
			jsonStr := strings.TrimPrefix(string(body), "if(typeof window.bing.sug == 'function') window.bing.sug(")
			jsonStr = strings.TrimSuffix(jsonStr, "/* pageview_candidate */);")
			var suggestionResponse models.BingSuggestionResponse
			var sortedSuggestionResponse models.SortedBingSuggestionResponse
			if err := json.Unmarshal([]byte(jsonStr), &suggestionResponse); err != nil {
				response.Fail(c, gin.H{}, "失败")
			} else {
				for _, obj := range suggestionResponse.AS.Results {
					for _, objNext := range obj.Suggests {
						sortedSuggestionResponse.Txt = append(sortedSuggestionResponse.Txt, objNext.Txt)
					}
				}
				response.Success(c, gin.H{"suggestion": sortedSuggestionResponse}, "成功")
			}
		}
	}
}

// 调用各大网站api
func GetMoreInfo(c *gin.Context) {
	typ := c.Query("type")

	r, err := http.Get(fmt.Sprintf("https://api.vvhan.com/api/hotlist?type=%s", typ))
	if err != nil {
		response.Fail(c, gin.H{}, "失败")
	} else {
		defer r.Body.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			response.Fail(c, gin.H{}, "失败")
		} else {
			if typ == "itInfo" {
				var getAPI models.GetITAPI
				var getData []models.DataGroup
				if err := json.Unmarshal(body, &getAPI); err != nil {
					response.Fail(c, gin.H{}, "失败")
				} else {
					for _, obj := range getAPI.Data {
						getData = append(getData, models.DataGroup{
							Rank: obj.Index,
							Name: obj.Title,
							Url:  obj.Url,
						})
					}
					response.Success(c, gin.H{"data": getData}, "成功")
				}
			} else if typ == "wbHot" {
				var getAPI models.GetWbAPI
				var getData []models.DataGroup
				if err := json.Unmarshal(body, &getAPI); err != nil {
					response.Fail(c, gin.H{}, "失败jj")
				} else {
					for _, obj := range getAPI.Data {
						getData = append(getData, models.DataGroup{
							Rank: obj.Index,
							Name: obj.Title,
							Url:  obj.Url,
						})
					}
					response.Success(c, gin.H{"data": getData}, "成功")
				}
			} else if typ == "zhihuHot" {
				var getAPI models.GetZHAPI
				var getData []models.DataGroup
				if err := json.Unmarshal(body, &getAPI); err != nil {
					response.Fail(c, gin.H{}, "失败")
				} else {
					for _, obj := range getAPI.Data {
						getData = append(getData, models.DataGroup{
							Rank: obj.Index,
							Name: obj.Title,
							Url:  obj.Url,
						})
					}
					response.Success(c, gin.H{"data": getData}, "成功")
				}
			} else if typ == "bili" {
				var getAPI models.GetBiliAPI
				var getData []models.DataGroup
				if err := json.Unmarshal(body, &getAPI); err != nil {
					response.Fail(c, gin.H{}, "失败")
				} else {
					for _, obj := range getAPI.Data {
						getData = append(getData, models.DataGroup{
							Rank: obj.Index,
							Name: obj.Title,
							Url:  obj.Url,
						})
					}
					response.Success(c, gin.H{"data": getData}, "成功")
				}
			}
		}
	}
}

// 添加日志
func AddLog(c *gin.Context) {
	var newLog *models.LogForm
	if err := c.ShouldBind(&newLog); err != nil {
		response.Fail(c, nil, "修改失败")
	} else {
		var findUser models.User
		result := mysql.DB.Where("id=?", newLog.Id).First(&findUser)
		if result.Error != nil {
			response.Fail(c, nil, "修改失败")
		} else if result.Error == nil {
			if err := mysql.DB.Model(&findUser).UpdateColumns(
				models.User{
					Log:  findUser.Log + newLog.Log + "@#$%",
					Date: findUser.Date + newLog.Date + "@#$%",
				}).Error; err != nil {
				response.Fail(c, gin.H{}, "修改失败")
			}
			response.Success(c, gin.H{}, "修改成功!")
		}
	}
}

// 查找日志
func GetLog(c *gin.Context) {
	userId := c.Param("userId")
	var findUser models.User
	result := mysql.DB.Where("id=?", userId).First(&findUser)
	if result.Error != nil {
		response.Fail(c, nil, "修改失败")
	} else if result.Error == nil {
		Log := strings.Split(findUser.Log, "@#$%")
		Date := strings.Split(findUser.Date, "@#$%")
		var RealLog []string
		var RealDate []string
		for i, obj := range Date {
			if searchItemInArray(Date[i+1:], obj) {

			} else {
				if obj != "" {
					RealLog = append(RealLog, Log[i])
					RealDate = append(RealDate, Date[i])
				}
			}
		}
		response.Success(c, gin.H{"log": RealLog, "Date": RealDate}, "修改成功!")
	}
}

func searchItemInArray(arr []string, target string) bool {
	for _, item := range arr {
		if item == target {
			return true
		}
	}
	return false
}
