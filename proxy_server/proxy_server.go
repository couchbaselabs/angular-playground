// this works
package main

import (
	"fmt"
	"net/http"
	"log"
  "io/ioutil"
  "bytes"
  "strconv"
  "strings"
  "time"
  "crypto/hmac"
  "crypto/sha256"
  "encoding/base64"
  "encoding/json"
  "os"
)


type Response struct {
    Content string
}
type ErrorResponse struct {
    Error string
}


func main() {
  // start server
  fmt.Println("start server")
  http.HandleFunc("/", handler)
  log.Fatal(http.ListenAndServe(":4201", nil))
}

func handler(w http.ResponseWriter, req *http.Request) {


    log.Printf("Handle Request: %#v\n", req.URL.Path)


    // we need to buffer the body if we want to read it here and send it
    // in the request.
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

    // We may want to filter some headers, otherwise we could just use a shallow copy
    // proxyReq.Header = req.Header
    proxyReq.Header = make(http.Header)
    for h, val := range req.Header {
        proxyReq.Header[h] = val
    }

    secret := os.Getenv("SECRET_KEY")
    access := os.Getenv("ACCESS_KEY")

    proxyReq.Header.Add("Content-Type", "application/json");
    now := strconv.FormatInt(time.Now().Unix(), 10)
    proxyReq.Header.Add("Couchbase-Timestamp", now)
    message := strings.Join([]string{"POST", req.URL.Path, now}, "\n")
    h := hmac.New(sha256.New, []byte(secret))
    h.Write([]byte(message))
    bearer := "Bearer " + access + ":" + base64.StdEncoding.EncodeToString(h.Sum(nil))
    proxyReq.Header.Add("Authorization", bearer)


    httpClient := http.Client{}


    log.Printf("PROXY REQ: %#v\n", proxyReq)
    log.Printf("PROXY REQ URL: %s\n", proxyReq.URL)

    resp, err := httpClient.Do(proxyReq)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadGateway)
        w.WriteHeader(http.StatusInternalServerError)
        mErr := ErrorResponse{err.Error()}
        r, _ := json.Marshal(mErr)
        w.Write(r)

        return
    } else {
        w.WriteHeader(resp.StatusCode)
        m := Response{"Success!"}
        r, _ := json.Marshal(m)

        w.Write(r)
    }

    log.Printf("RESPONSE: %#v\n", resp)
    log.Printf("RESPONSE ERR: %#v\n", err)

    defer resp.Body.Close()
}
