package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var serverCmd = &cobra.Command{
	Use:   "server ",
	Short: "collect files, display files.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("run c.colorate...")
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)
}
