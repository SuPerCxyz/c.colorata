package api

import (
	"github.com/gin-gonic/gin"
	"os"
	"path/filepath"
)

type ContentInfo struct {
	ContentType string `json:"content_type"`
	Name        string `json:"name"`
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
	// err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
	// 	frs.file = append(frs.file, path)
	// 	return nil
	// })
	err := filepath.WalkDir(dirPath, func(path string, d os.DirEntry, err error) error {
		// Skip the root directory itself
		if path == dirPath {
			return nil
		}

		// Get the relative path (without the base directory)
		relPath, _ := filepath.Rel(dirPath, path)

		// Check if it's a directory
		if d.IsDir() {
			frs.file = append(frs.file, ContentInfo{"dir", relPath})
		} else {
			// Append to the file list if it's not a directory
			frs.file = append(frs.file, ContentInfo{"file", relPath})
		}

		return nil
	})

	if err != nil {
		panic(err)
	}
	JSONData(c, frs.file)
}
