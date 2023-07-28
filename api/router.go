package api

import (
	"github.com/gin-gonic/gin"
	// "net/http"
)

// var defaultHandler = func(c *gin.Context) {
// 	c.JSON(http.StatusOK, gin.H{
// 		"path": c.FullPath(),
// 	})
// }

// type Resource interface {
// 	Register(router *gin.RouterGroup)
// }

func SetupRoutes(ge *gin.Engine) {
	fileRouter := ge.Group("/file")
	fr := FileResource()
	fr.Register(fileRouter)
	// SetupResource(fileRouter, )
}
