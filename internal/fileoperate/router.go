package fileoperate

import (
	"github.com/SuPerCxyz/c.colorata/internal"
	"github.com/gin-gonic/gin"
	// "net/http"
)

func SetupRoutes(ge *gin.Engine) {
	gr := ge.Group("/file")
	utils.SetupResource(gr, FileResource(), ListStorage())
}
