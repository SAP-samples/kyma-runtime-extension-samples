package saas

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"path"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
)

func Provision(w http.ResponseWriter, r *http.Request) {
	fmt.Println("---- provision ----")
	dumpReq(r)

	c := appconfig.GetConfig()
	tenant := path.Base(r.URL.Path)

	w.Write([]byte(c.AppURL + "/" + tenant))
}

func Deprovision(w http.ResponseWriter, r *http.Request) {
	fmt.Println("---- deprovision ----")
	dumpReq(r)

	w.WriteHeader(http.StatusOK)
}

func dumpReq(req *http.Request) {
	// Save a copy of this request for debugging.
	requestDump, err := httputil.DumpRequest(req, true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(requestDump))
}
