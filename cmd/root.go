package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "c.colorate",
	Short: "collect files, display files.",
	Long: `Provide a variety of input terminals for collecting files of different protocols and locations,
and display them in a user-friendly manner`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
