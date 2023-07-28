package cmd

import (
	// "fmt"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	// "log"
	// "net/http"

	"github.com/SuPerCxyz/c.colorata/api"
)

var serverCmd = &cobra.Command{
	Use:   "server ",
	Short: "collect files, display files.",
	Run: func(cmd *cobra.Command, args []string) {
		serverRun()
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)
	serverCmd.Flags().Int("port", 8222, "server port")
	viper.BindPFlags(serverCmd.Flags())
}

func serverRun() {
	ge := gin.Default()
	api.SetupRoutes(ge)
	ge.Run()
	// addr := fmt.Sprintf(":%d", viper.GetInt("port"))
	// srv := &http.Server{
	// 	Addr:    addr,
	// 	Handler: ge,
	// }

	// go func() {
	// 	log.Printf("[rest server listen at %s]", srv.Addr)
	// 	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
	// 		log.Fatalln(err)
	// 	}
	// }()

	// httputil.SetupGracefulStop(srv)
}
