package utils

import (
	"fmt"
	"strings"
)

func FullUrl(baseUrl string, segment string) string {
	if strings.HasSuffix(baseUrl, "/") {
		return fmt.Sprintf("%s%s", baseUrl, segment)
	} else if strings.HasPrefix(segment, "/") {
		return fmt.Sprintf("%s%s", baseUrl, segment)
	} else {
		return fmt.Sprintf("%s/%s", baseUrl, segment)
	}
}
