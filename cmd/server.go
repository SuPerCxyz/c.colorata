package cmd

import (
	// "fmt"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	// "log"
	"net/http"
	"strconv"

	"github.com/SuPerCxyz/c.colorata/internal/fileoperate"
	"github.com/SuPerCxyz/c.colorata/internal/user"
)

type Data struct {
	Message string
}

var port int
var serverCmd = &cobra.Command{
	Use:   "server ",
	Short: "collect files, display files.",
	Run: func(cmd *cobra.Command, args []string) {
		serverRun()
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)
	serverCmd.Flags().IntVarP(&port, "port", "p", 8222, "server port")
	viper.BindPFlags(serverCmd.Flags())
}

func serverRun() {
	ge := gin.Default()
	ge.StaticFile("/favicon.ico", "web/img/favicon.ico")
	ge.LoadHTMLGlob("web/*.html")
	ge.Static("/web", "./web")
	fileoperate.SetupRoutes(ge)
	user.SetupRoutes(ge)

	ge.GET("/login", func(c *gin.Context) {
		c.HTML(http.StatusOK, "login.html", nil)
	})

	ge.GET("/", func(c *gin.Context) {
		data := Data{
			Message: "Hello from the backend!",
		}
		c.HTML(http.StatusOK, "index.html", gin.H{
			"data": data,
		})
	})
	ge.Run(":" + strconv.Itoa(viper.GetInt("port")))
}
