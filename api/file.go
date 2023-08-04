package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
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
	// EnableRead  bool      `json:"enable_read"`
	// EnableWrite bool      `json:"enable_write"`
	// Enter       bool      `json:"enter"`
}

type FileResourceStruct struct {
	file []ContentInfo
}

func FileResource() *FileResourceStruct {
	return &FileResourceStruct{}
}

func (frs *FileResourceStruct) Register(router *gin.RouterGroup) {
	router.POST("/file", frs.listDirFile)
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
		panic(err)
	}
	files, err := f.Readdir(-1)
	f.Close()

	if err != nil {
		log.Fatal(err)
	}

	frs.file = []ContentInfo{}
	sizes := []string{"B", "KiB", "MiB", "GiB", "TiB"}
	for _, file := range files {
		file_name := file.Name()
		absPath := filepath.Join(dirPath, file_name)
		fileInfo, err := os.Stat(absPath)
		modTime := fileInfo.ModTime()
		if err != nil {
			panic(err)
		}

		if fileInfo.Mode()&os.ModeSymlink != 0 {
			// 如果是软连接，则获取链接指向的实际文件或目录信息
			frs.file = append(frs.file, ContentInfo{"link", file_name, absPath, "-", modTime})
		} else {
			// readErr := syscall.Access(absPath, syscall.O_RDWR)
			// writeErr := syscall.Access(absPath, syscall.O_WRONLY)
			// var read bool
			// if readErr == nil {
			// 	read = false
			// } else {
			// 	read = true
			// }
			// var write bool
			// if writeErr == nil {
			// 	write = true
			// } else {
			// 	write = false
			// }

			if fileInfo.IsDir() {
				frs.file = append(frs.file, ContentInfo{"dir", file_name, absPath, "-", modTime})
				// if read {
				// 	frs.file = append(frs.file, ContentInfo{"dir", absPath, "-", modTime, read, write, true})
				// } else {
				// 	frs.file = append(frs.file, ContentInfo{"dir", absPath, "-", modTime, read, write, false})
				// }
			} else {
				size_B := float64(fileInfo.Size())
				var i int
				for i = 0; size_B >= 1024 && i < len(sizes)-1; i++ {
					size_B /= 1024
				}
				file_size := fmt.Sprintf("%.2f %s", size_B, sizes[i])
				frs.file = append(frs.file, ContentInfo{"file", file_name, absPath, file_size, modTime})
				// if read {
				// 	frs.file = append(frs.file, ContentInfo{"file", absPath, file_size, modTime, read, write, true})
				// } else {
				// 	frs.file = append(frs.file, ContentInfo{"file", absPath, file_size, modTime, read, write, false})
				// }
			}
		}
	}
	JSONData(c, frs.file)
}
