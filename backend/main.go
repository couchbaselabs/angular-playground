package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
	"log"
    "io/ioutil"
    "bytes"
    "encoding/json"
    "backend/client"
)

type Response struct {
    Content string
}
type ErrorResponse struct {
    Error string
}
type ProjectPayload struct {
    Name string `json:"name"`
}

type Place struct {
	SingleAZ bool  `json:"singleAZ"`
}

type ClusterCreateServerAWS struct {
	InstanceSize string `json:"instanceSize"`
	EbsSizeGib   int    `json:"ebsSizeGib"`
}

type SupportPackageType struct {
    Timezone string `json:"timezone"`
    Type     string `json:"type"`
}

type StorageType struct {
    Type         string  `json:"type"`
    IOPSField    int     `json:"IOPS"`
    Size         int     `json:"size"`
}

type Server struct {
	Size     int                    `json:"size"`
	Compute  string                 `json:"compute"`
    Services []string               `json:"services"`
    Storage  StorageType            `json:"storage"`
}

type ClusterPayload struct {
	Environment        string               `json:"environment"`
    ClusterName        string               `json:"clusterName"`
	ProjectId          string               `json:"projectId"`
    Place              Place                `json:"place"`
    Servers            []Server             `json:"servers"`
    SupportPackage     SupportPackageType   `json:"supportPackage"`
}

func main() {
    fmt.Println("start server")

    router := mux.NewRouter()

    router.HandleFunc("/", projectsHandler)
    router.HandleFunc("/v2/projects", projectsHandler)
    router.HandleFunc("/v2/projects/{id}", projectsHandler)
    router.HandleFunc("/v3/clusters", clustersHandler)
    router.HandleFunc("/v3/clusters/{id}", clustersHandler)

    http.Handle("/", router)
    log.Fatal(http.ListenAndServe(":4201", nil))
}

func projectsHandler(w http.ResponseWriter, req *http.Request) {
    // we need to buffer the body if we want to read
    // it here and send it in the request.
    body, err := ioutil.ReadAll(req.Body)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    // you can reassign the body if you need to parse it as multipart
    req.Body = ioutil.NopCloser(bytes.NewReader(body))

    var payload *ProjectPayload
    json.Unmarshal(body, &payload)

    url := "https://cloudapi.cloud.couchbase.com" + req.URL.Path;
    proxyReq, err := http.NewRequest(req.Method, url, bytes.NewReader(body))

    handler(w, proxyReq, getProjectPayload(payload))
}

func clustersHandler(w http.ResponseWriter, req *http.Request) {
    // we need to buffer the body if we want to read
    // it here and send it in the request.
    body, err := ioutil.ReadAll(req.Body)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    // you can reassign the body if you need to parse it as multipart
    req.Body = ioutil.NopCloser(bytes.NewReader(body))

    var payload *ClusterPayload
    json.Unmarshal(body, &payload)

    url := "https://cloudapi.cloud.couchbase.com" + req.URL.Path;
    proxyReq, err := http.NewRequest(req.Method, url, bytes.NewReader(body))

    handler(w, proxyReq, getClusterPayload(payload))
}

func handler(w http.ResponseWriter, proxyReq *http.Request, payload interface {}) {
    log.Printf("Proxy Request: %#v\n\n\n", proxyReq)

    httpClient := client.New()

    resp, err := httpClient.Do(proxyReq.Method, proxyReq.URL.Path, payload)

    if err != nil {
      http.Error(w, err.Error(), http.StatusBadGateway)
      w.WriteHeader(http.StatusInternalServerError)
      mErr := ErrorResponse{err.Error()}
      r, _ := json.Marshal(mErr)
      w.Write(r)

      return
    } else {
      w.WriteHeader(resp.StatusCode)
      body, _ := ioutil.ReadAll(resp.Body)
      r, _ := json.Marshal(string(body))

      w.Write(r)
    }

    defer resp.Body.Close()
}

func getProjectPayload(payload *ProjectPayload) interface{} {
  if payload != nil {
    return payload
  }

  return nil
}

func getClusterPayload(payload *ClusterPayload) interface{} {
  if payload != nil {
    return payload
  }

  return nil
}

