package user

import (
	"github.com/SuPerCxyz/c.colorata/internal"
	// "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"net/http"
	// "net/http"
	// "time"
)

func SetupRoutes(ge *gin.Engine) {
	gr := ge.Group("/user")
	// gr.Use(utils.AuthMiddleware())
	utils.SetupResource(gr, UserInfo())
	gr1 := ge.Group("/auth")
	// gr1.Use(utils.AuthMiddleware())
	utils.SetupResource(gr1, Authentication())
	// 添加 /login 路径，返回 login.html 页面
	ge.GET("/login", func(c *gin.Context) {
		c.HTML(http.StatusOK, "login.html", nil) // 使用 "html/login.html"
	})
}
