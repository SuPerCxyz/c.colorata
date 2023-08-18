package fileoperate

import (
	"github.com/SuPerCxyz/c.colorata/internal"
	"github.com/gin-gonic/gin"
	// "net/http"
)

func SetupRoutes(ge *gin.Engine) {
	gr := ge.Group("/file")
	gr.Use(utils.AuthMiddleware())
	utils.SetupResource(gr, FileResource(), ListStorage())
	// ge.GET("/localfile", func(c *gin.Context) {
	// 	c.HTML(http.StatusOK, "localfile.html", nil) // 使用 "html/login.html"
	// })
}
