package fileoperate

import (
	"github.com/gin-gonic/gin"
	// "net/http"
)

type Resource interface {
	Register(router *gin.RouterGroup)
}

func SetupResource(gr *gin.RouterGroup, resources ...Resource) {
	for _, resource := range resources {
		resource.Register(gr)
	}
}

func SetupRoutes(ge *gin.Engine) {
	gr := ge.Group("/api")
	SetupResource(gr, FileResource(), ListStorage())
}
