package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	// "net/http"
	"os"
	"path/filepath"
	"time"
)

type ContentInfo struct {
	ContentType string    `json:"content_type"`
	Name        string    `json:"name"`
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
	router.GET("/list", frs.listDirFile)
}

func (frs *FileResourceStruct) listDirFile(c *gin.Context) {
	dirPath := "/tmp"
	f, err := os.Open(dirPath)
	if err != nil {
		panic(err)
	}
	files, err := f.Readdir(-1)
	f.Close()

	if err != nil {
		log.Fatal(err)
	}
	frs.file = nil
	for _, file := range files {
		absPath := filepath.Join(dirPath, file.Name())
		fileInfo, err := os.Stat(absPath)
		modTime := fileInfo.ModTime()
		if err != nil {
			panic(err)
		}
		if fileInfo.IsDir() {
			frs.file = append(frs.file, ContentInfo{"dir", absPath, "", modTime})
		} else {
			sizes := []string{"B", "KiB", "MiB", "GiB", "TiB"}
			size_B := float64(fileInfo.Size())
			var i int
			for i = 0; size_B >= 1024 && i < len(sizes)-1; i++ {
				size_B /= 1024
			}
			file_size := fmt.Sprintf("%.2f %s", size_B, sizes[i])
			frs.file = append(frs.file, ContentInfo{"file", absPath, file_size, modTime})
		}
	}
	JSONData(c, frs.file)
}
