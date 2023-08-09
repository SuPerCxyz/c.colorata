package fileoperate

import (
	"database/sql"
	"github.com/SuPerCxyz/c.colorata/internal"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
	"log"
	"net/http"
)

type StorageInfo struct {
	Name        string `json:"name"`
	StorageType string `json:"storage_type"`
	Path        string `json:"path"`
	Username    string `json:"username"`
	Password    string `json:"password"`
}

type ListStorageStruct struct {
	storages []StorageInfo
}

func ListStorage() *ListStorageStruct {
	return &ListStorageStruct{}
}

func (ls *ListStorageStruct) Register(router *gin.RouterGroup) {
	router.GET("/storages", ls.getBackendStorage)
	router.POST("/storages", ls.createBackendStorage)
}

func (ls *ListStorageStruct) getBackendStorage(c *gin.Context) {
	ls.storages = nil
	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	query := "SELECT id, name, type, path, username, password FROM storage_list;"
	rows, err := db.Query(query)
	if err != nil {
		log.Println(err)
		utils.JSONData(c, ls.storages)
		return
	}
	for rows.Next() {
		var id int
		var name string
		var stype string
		var path string
		var username string
		var password string
		err := rows.Scan(&id, &name, &stype, &path, &username, &password)
		if err != nil {
			log.Fatal(err)
		}
		storage_info := &StorageInfo{name, stype, path, username, password}
		ls.storages = append(ls.storages, *storage_info)
	}
	utils.JSONData(c, ls.storages)
}

func (ls *ListStorageStruct) createBackendStorage(c *gin.Context) {
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
	createTable := `
	CREATE TABLE IF NOT EXISTS storage_list (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		type TEXT NOT NULL,
		path TEXT NOT NULL,
		username TEXT NOT NULL,
		password TEXT NOT NULL
	);`
	_, err = db.Exec(createTable)
	if err != nil {
		log.Fatal(err)
	}
	insertData := "INSERT INTO storage_list (name, type, path, username, password) VALUES (?, ?, ?, ?, ?);"
	_, err = db.Exec(insertData, requestData["name"].(string), requestData["stype"].(string), requestData["path"].(string), requestData["username"].(string), requestData["password"].(string))
	if err != nil {
		log.Fatal(err)
	}
}
