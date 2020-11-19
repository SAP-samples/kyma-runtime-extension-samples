package main

import (
	"context"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/config"
	"github.com/SAP-samples/kyma-runtime-extension-samples/user-propagation/c4c-extension-with-user-context/internal/router"
	"log"
	"net/http"
	"os"
	"syscall"
)

func main() {
	config.Init()

	rtr := router.New()

	srv := http.Server{
		Addr:    ":" + "8080",
		Handler: rtr,
	}

	go func() {
		log.Fatal(srv.ListenAndServe())
	}()

	interrupt := make(chan os.Signal, 1)
	killSignal := <-interrupt
	switch killSignal {
	case os.Interrupt:
		log.Println("got os interrupt")
	case syscall.SIGTERM:
		log.Println("got sigterm")
	}
	log.Println("server is shutting down")

	srv.Shutdown(context.Background())

	log.Println("done...")
}
