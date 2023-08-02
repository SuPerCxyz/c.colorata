package api

import (
	"github.com/gin-gonic/gin"
)

type StorageInfo struct {
	StorageType string `json:"storage_type"`
	Name        string `json:"name"`
	Path        string `json:"path"`
}

type ListStorageStruct struct {
	storages []StorageInfo
}

func ListStorage() *ListStorageStruct {
	return &ListStorageStruct{}
}

func (ls *ListStorageStruct) Register(router *gin.RouterGroup) {
	router.GET("/storages", ls.getBackendStorage)
}

func (ls *ListStorageStruct) getBackendStorage(c *gin.Context) {
	ls.storages = nil
	storage1 := &StorageInfo{"local", "test", "/tmp"}
	storage2 := &StorageInfo{"local", "sys", "/sys"}
	ls.storages = append(ls.storages, *storage1)
	ls.storages = append(ls.storages, *storage2)
	JSONData(c, ls.storages)

}
