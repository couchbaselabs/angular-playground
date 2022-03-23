package client

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
  "os"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	headerKeyTimestamp     = "Couchbase-Timestamp"
	headerKeyAuthorization = "Authorization"
	headerKeyContentType   = "Content-Type"
)

type Client struct {
	baseURL    string
	access     string
	secret     string
	httpClient *http.Client
}

func New() *Client {
	return &Client{
		baseURL:    os.Getenv("BASE_URL"),
		access:     os.Getenv("ACCESS_KEY"),
		secret:     os.Getenv("SECRET_KEY"),
		httpClient: http.DefaultClient,
	}
}

func (c *Client) Do(method, uri string, body interface{}) (*http.Response, error) {
	var bb io.Reader

	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal body: %w", err)
		}

		bb = bytes.NewReader(b)
	}

	r, err := http.NewRequest(method, c.baseURL+uri, bb)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	r.Header.Add(headerKeyContentType, "application/json")

	now := strconv.FormatInt(time.Now().Unix(), 10)
	r.Header.Add(headerKeyTimestamp, now)

	payload := strings.Join([]string{method, uri, now}, "\n")
	h := hmac.New(sha256.New, []byte(c.secret))
	h.Write([]byte(payload))

	bearer := "Bearer " + c.access + ":" + base64.StdEncoding.EncodeToString(h.Sum(nil))
	r.Header.Add(headerKeyAuthorization, bearer)

	return c.httpClient.Do(r)
}
