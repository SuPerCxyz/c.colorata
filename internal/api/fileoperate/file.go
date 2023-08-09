package fileoperate

import (
	"fmt"
	"github.com/SuPerCxyz/c.colorata/internal"
	"github.com/gin-gonic/gin"
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
	router.POST("/file", frs.listDirFile)
	router.POST("/file/download", frs.fileDownload)
}

func (frs *FileResourceStruct) listDirFile(c *gin.Context) {
	var requestData map[string]interface{}
	if err := c.BindJSON(&requestData); err != nil {
		// 处理请求数据解析错误
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	dirPath := requestData["path"].(string)
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
		// 处理请求数据解析错误
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	filePath := requestData["path"].(string)
	c.Header("Content-Disposition", "attachment; filename=file.txt")
	c.Header("Content-Type", "application/octet-stream")
	c.File(filePath)
}
