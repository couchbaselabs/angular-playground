package main

import (
	"fmt"
	"net/http"
	"log"
  "io/ioutil"
  "bytes"
  "encoding/json"

  "github.com/couchbasecloud/rest-api-examples/go/utils"
)

type Response struct {
    Content string
}
type ErrorResponse struct {
    Error string
}
type Payload struct {
	Name string `json:"name"`
}

func main() {
  // start server
  fmt.Println("start server")
  http.HandleFunc("/", handler)
  log.Fatal(http.ListenAndServe(":4201", nil))
}

func handler(w http.ResponseWriter, req *http.Request) {
    log.Printf("Handle Request: %#v\n", req.URL.Path)

    // we need to buffer the body if we want to read
    // it here and send it in the request.
    body, err := ioutil.ReadAll(req.Body)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // you can reassign the body if you need to parse it as multipart
    req.Body = ioutil.NopCloser(bytes.NewReader(body))

    // create a new url from the raw RequestURI sent by the client
    url := "https://cloudapi.cloud.couchbase.com/" + req.URL.Path;

    proxyReq, err := http.NewRequest(req.Method, url, bytes.NewReader(body))

    log.Printf("Proxy Request: %#v\n\n\n", proxyReq)

    httpClient := utils.NewClient()

    if req.Method == "POST" {
      var payload Payload
      json.Unmarshal(body, &payload)
      resp, err := httpClient.Do(proxyReq.Method, req.URL.Path, payload)

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
    } else {
      resp, err := httpClient.Do(proxyReq.Method, req.URL.Path, nil)
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
}

