package fileoperate

import (
	"database/sql"
	"fmt"
	"github.com/SuPerCxyz/c.colorata/internal"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/spf13/viper"
	"log"
	// "log"
	"net/http"
	"os"
	"path/filepath"
	// "syscall"
	"time"
)

type ContentInfo struct {
	ContentType string    `json:"content_type"`
	Name        string    `json:"name"`
	Path        string    `json:"path"`
	Size        string    `json:"size"`
	ModifyTime  time.Time `json:"modify_time"`
}

type FileResourceStruct struct {
	file []ContentInfo
}

func FileResource() *FileResourceStruct {
	return &FileResourceStruct{}
}

func (frs *FileResourceStruct) Register(router *gin.RouterGroup) {
	router.POST("/localfile", frs.listDirFile)
	router.POST("/localfile/download", frs.fileDownload)
	router.POST("/localfile/upload", frs.fileUpload)
}

func (frs *FileResourceStruct) listDirFile(c *gin.Context) {
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
	selectData := "SELECT (path) FROM storage_list where name = (?)"
	rows, err := db.Query(selectData, requestData["storage_name"].(string))
	if err != nil {
		log.Fatal(err)
	}
	var dirPath string
	for rows.Next() {
		if err := rows.Scan(&dirPath); err != nil {
			log.Fatal(err)
		}
	}
	dirPath = dirPath + "/" + requestData["request_path"].(string)
	f, err := os.Open(dirPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	files, err := f.Readdir(-1)
	f.Close()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	frs.file = []ContentInfo{}
	sizes := []string{"B", "KiB", "MiB", "GiB", "TiB"}
	for _, file := range files {
		file_name := file.Name()
		absPath := filepath.Join(dirPath, file_name)
		fileInfo, err := os.Stat(absPath)
		modTime := fileInfo.ModTime()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		if fileInfo.Mode()&os.ModeSymlink != 0 {
			frs.file = append(frs.file, ContentInfo{"link", file_name, absPath, "-", modTime})
		} else {
			if fileInfo.IsDir() {
				frs.file = append(frs.file, ContentInfo{"dir", file_name, absPath, "-", modTime})
			} else {
				size_B := float64(fileInfo.Size())
				var i int
				for i = 0; size_B >= 1024 && i < len(sizes)-1; i++ {
					size_B /= 1024
				}
				file_size := fmt.Sprintf("%.2f %s", size_B, sizes[i])
				frs.file = append(frs.file, ContentInfo{"file", file_name, absPath, file_size, modTime})
			}
		}
	}
	utils.JSONData(c, frs.file)
}

func (frs *FileResourceStruct) fileDownload(c *gin.Context) {
	var requestData map[string]interface{}
	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	selectData := "SELECT (path) FROM storage_list where name = (?)"
	rows, err := db.Query(selectData, requestData["storage_name"].(string))
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		log.Fatal(err)
	}
	var dirPath string
	for rows.Next() {
		if err := rows.Scan(&dirPath); err != nil {
			log.Fatal(err)
		}
	}
	filePath := dirPath + "/" + requestData["request_path"].(string)
	c.Header("Content-Disposition", "attachment; filename=file.txt")
	c.Header("Content-Type", "application/octet-stream")
	c.File(filePath)
}

func (frs *FileResourceStruct) fileUpload(c *gin.Context) {
	const maxUploadSize = 10 * 1024 * 1024 * 1024 // 10GB
	if err := c.Request.ParseMultipartForm(maxUploadSize); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// 获取表单字段数据
	// storageName := c.Request.FormValue("storage_name")
	requestPath := c.Request.FormValue("request_path")

	db_file := viper.GetString("database.path")
	db, err := sql.Open("sqlite3", db_file)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	selectData := "SELECT (path) FROM storage_list where name = (?)"
	// rows, err := db.Query(selectData, requestData["storage_name"].(string))
	rows, err := db.Query(selectData, "sdsaf")
	if err != nil {
		log.Fatal(err)
	}
	var dirPath string
	for rows.Next() {
		if err := rows.Scan(&dirPath); err != nil {
			log.Fatal(err)
		}
	}

	targetPath := dirPath + "/" + requestPath

	// 获取上传的文件
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	filePath := filepath.Join(targetPath, file.Filename)
	fmt.Println(filePath)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("File %s uploaded successfully", file.Filename),
	})
}
