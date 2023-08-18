package utils

import (
	"database/sql"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
	"strings"
)

type JSONResponse struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data,omitempty"`
}

// JSONResponse
func NewJSONResponse(data interface{}) *JSONResponse {
	return &JSONResponse{Code: 0, Msg: "ok", Data: data}
}

func JSONData(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, NewJSONResponse(data))
}

func HandleError() {
	logFile, err := os.Create("error.log")
	if err != nil {
		log.Fatal("无法创建日志文件:", err)
	}
	defer logFile.Close()

	log.SetOutput(logFile)
}

func LinkDB() *sql.DB {
	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

type Resource interface {
	Register(router *gin.RouterGroup)
}

func SetupResource(gr *gin.RouterGroup, resources ...Resource) {
	for _, resource := range resources {
		resource.Register(gr)
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取传入请求中的JWT令牌
		tokenString := c.GetHeader("Authorization")
		if len(tokenString) > 7 && strings.ToUpper(tokenString[0:6]) == "BEARER" {
			tokenString = tokenString[7:]
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			return
		}

		// 验证令牌是否有效
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("your-secret-key"), nil // 替换为你的实际密钥
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// 令牌有效，继续处理请求
		c.Next()
	}
}
