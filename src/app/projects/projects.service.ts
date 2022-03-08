import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as crypto from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  addProject(projectName: string) {
    const cbc_api_endpoint = '/v3/projects';
    const cbc_api_method = 'POST';
    const cbc_secret_key = 'cbc_secret_key';
    const cbc_access_key = 'cbc_access_key';

    // Epoch time in milliseconds
    const cbc_api_now = new Date().getTime().toString();

    // Form the message string from the Hmac hash
    const cbc_api_message = cbc_api_method + '\n' + cbc_api_endpoint +
      '\n' + cbc_api_now.toString();

    // Calculate the hmac hash value with secret key and message
    const enc = new TextEncoder();
    const encoded = enc.encode(cbc_api_message);

    const cbc_api_signature = new Crypto().subtle.sign('HMAC', cbc_secret_key, encoded);

    const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Authorization', 'Bearer ' + cbc_access_key + ':' + cbc_api_signature)
        .set('Couchbase-Timestamp', cbc_api_now)

    this.httpClient.post('https://cloudapi.cloud.couchbase.com/v2/projects',
        {name: projectName},
        {headers: headers});
  }

  getProjects() {

  }
}
