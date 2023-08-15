package user

import (
	"github.com/SuPerCxyz/c.colorata/internal"
	// "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
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
}
