package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
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
