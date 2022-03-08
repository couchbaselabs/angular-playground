// this works
package main

import "fmt"
import "net/http"
import "log"
import "io/ioutil"
import "bytes"
import "strconv"
import "strings"
import "time"
import "crypto/hmac"
import "crypto/sha256"
import "encoding/base64"


func main() {
  // start server
  fmt.Println("start server")
  http.HandleFunc("/", handler)
  log.Fatal(http.ListenAndServe(":4201", nil))
}

func handler(w http.ResponseWriter, req *http.Request) {


    log.Printf("HERE")

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
//     url := fmt.Sprintf("%s://%s%s", proxyScheme, proxyHost, req.RequestURI)
     url := "https://cloudapi.cloud.couchbase.com/v2/projects"

    proxyReq, err := http.NewRequest(req.Method, url, bytes.NewReader(body))

    // We may want to filter some headers, otherwise we could just use a shallow copy
    // proxyReq.Header = req.Header
    proxyReq.Header = make(http.Header)
    for h, val := range req.Header {
        proxyReq.Header[h] = val
    }

    secret := "SECRET_KEY"
    access := "ACCESS_KEY"

    proxyReq.Header.Add("Content-Type", "application/json");
    now := strconv.FormatInt(time.Now().Unix(), 10)
    proxyReq.Header.Add("Couchbase-Timestamp", now)
    message := strings.Join([]string{"POST", "/v2/projects", now}, "\n")
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
        return
    }


    log.Printf("RESPONSE: %#v\n", resp)
    log.Printf("RESPONSE ERR: %#v\n", err)

    defer resp.Body.Close()

    // legacy code
}
