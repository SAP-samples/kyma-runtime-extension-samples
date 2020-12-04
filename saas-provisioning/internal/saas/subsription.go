package saas

import (
	"fmt"
	"net/http"
	"net/http/httputil"

	appconfig "github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning/internal/config"
)

func SubProvision(w http.ResponseWriter, r *http.Request) {
	fmt.Println("---- SubProvision ----")
	dumpReq(r)

	c := appconfig.GetConfig()

	w.Write([]byte(c.TenantURL))
	w.WriteHeader(http.StatusOK)
}

func SubDeprovision(w http.ResponseWriter, r *http.Request) {
	fmt.Println("---- SubDeprovision ----")
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
