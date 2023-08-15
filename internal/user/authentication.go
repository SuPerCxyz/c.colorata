package user

import (
	"database/sql"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"strings"
	"time"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	// 其他用户相关信息
}

type AuthenticationStruct struct{}

func Authentication() *AuthenticationStruct {
	return &AuthenticationStruct{}
}

func (as *AuthenticationStruct) Register(router *gin.RouterGroup) {
	router.POST("/login", as.generateToken)
	router.POST("/verify", as.verifyToken)
}

func (as *AuthenticationStruct) generateToken(c *gin.Context) {
	// 在实际应用中，可以根据请求中的用户名和密码进行用户验证
	var requestData map[string]interface{}
	if err := c.BindJSON(&requestData); err != nil {
		// 处理请求数据解析错误
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	username := requestData["username"].(string)
	var password string
	err = db.QueryRow("SELECT password FROM users WHERE username = ?", username).Scan(&password)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Username is invalid"})
			return
		} else {
			log.Fatal(err)
		}
	}

	if password != requestData["password"].(string) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password is invalid"})
		return
	}

	// 假设验证成功，生成JWT令牌
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,                              // 用户名
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // 令牌过期时间
	})

	// 使用密钥签名令牌
	tokenString, err := token.SignedString([]byte("your-secret-key")) // 替换为你的实际密钥
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	// 返回令牌给客户端
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func isValidToken(tokenString string) bool {
	// Define your JWT secret key
	secretKey := "your-secret-key"

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return false // Token parsing error
	}

	if token.Valid {
		return true // Token is valid
	}

	return false // Token is invalid
}

func (as *AuthenticationStruct) verifyToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	// Extract the token from the Authorization header
	if len(tokenString) > 7 && strings.ToUpper(tokenString[0:6]) == "BEARER" {
		tokenString = tokenString[7:]
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return
	}
	fmt.Println(tokenString)
	if isValidToken(tokenString) {
		c.JSON(http.StatusOK, gin.H{"message": "Token is valid"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is invalid"})
	}
}
