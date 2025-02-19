package router

import (
	"backend/control"
	"backend/logic"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// 用户路由组
func UserRouterInit(r *gin.RouterGroup) {
	userManager := r.Group("/user")
	{
		userManager.POST("/register", control.RegisterHandler)
		userManager.POST("/login", control.LoginHandler)
		userManager.POST("/settings", control.Settings)
		userManager.POST("/deleteAccount", control.DeleteAccount)
		userManager.POST("/uploadBackground", control.UploadBackground)
		userManager.POST("/uploadAvatar", control.UploadAvatar)
		userManager.POST("/changePassword", control.ChangePasswd)
		userManager.POST("/changeUserName", control.ChangeUserName)
		userManager.POST("/newURL/:userId", control.PostNewURL)
		userManager.POST("/record/:userId", control.PostRecord)
		userManager.POST("/log", control.AddLog)
		userManager.GET("/myURL/:userId", control.GetMyURL)
		userManager.GET("/image/:imageIndex", control.OnImagesGet)
		userManager.GET("/web-images", control.WebImages)
		userManager.GET("/baiduSuggestion", control.GetBaiduSuggestion)
		userManager.GET("/bingSuggestion", control.GetBingSuggestion)
		userManager.GET("/googleSuggestion", control.GetGoogleSuggestion)
		userManager.GET("/getMoreInfo", control.GetMoreInfo)
		userManager.GET("/myLog/:userId", control.GetLog)

		userManager.Use(logic.AuthMiddleware())
	}
}

func SetupRouter() *gin.Engine {
	router := gin.Default()
	// 添加CORS中间件
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "http://localhost:8083",
		"http://localhost:8084", "http://localhost:8085"} // 允许访问的域名
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"} // 允许的HTTP方法
	router.Use(cors.New(config))
	api := router.Group("")
	UserRouterInit(api)
	//NewsRouterInit(api)
	//CommentRouterInit(api)
	return router
}
