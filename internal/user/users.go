package user

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
	"log"
	"net/http"
)

// type User struct {
// 	ID       uint   `json:"id"`
// 	Username string `json:"username"`
// 	// 其他用户相关信息
// }

type UserInfoStruct struct{}

func UserInfo() *UserInfoStruct {
	return &UserInfoStruct{}
}

func (uis *UserInfoStruct) Register(router *gin.RouterGroup) {
	router.POST("/create", uis.userCreate)
}

func (uis *UserInfoStruct) userCreate(c *gin.Context) {
	var requestData map[string]interface{}
	if err := c.BindJSON(&requestData); err != nil {
		// 处理请求数据解析错误
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		fmt.Println(err)
		log.Fatal(err)
	}
	defer db.Close()

	createTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL,
		password TEXT NOT NULL,
		mail TEXT
	);`
	_, err = db.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
	insertData := "INSERT INTO users (username, password, mail) VALUES (?, ?, ?);"
	_, err = db.Exec(insertData, requestData["username"].(string), requestData["password"].(string), requestData["email"].(string))
	if err != nil {
		fmt.Println(err)
		log.Fatal(err)
	}
}
