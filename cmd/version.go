package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var versioncmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of C.colorata.",
	Long:  "All software has versions of C.colorata.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("C.colorata alpha.")
	},
}

func init() {
	rootCmd.AddCommand(versioncmd)
}
