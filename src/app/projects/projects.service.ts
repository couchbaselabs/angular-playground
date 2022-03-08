import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async addProject(projectName: string) {
    const cbc_api_endpoint = '/v3/projects';
    const cbc_api_method = 'POST';
    const cbc_secret_key = 'cbc_secret_key';
    const cbc_access_key = 'cbc_access_key';

    // Epoch time in milliseconds
    const cbc_api_now = new Date().getTime().toString();

    // Form the message string from the Hmac hash
    const cbc_api_message = cbc_api_method + '\n' + cbc_api_endpoint +
      '\n' + cbc_api_now.toString();

    const cbc_api_signature = await this.hmacSha256Hex(cbc_secret_key, cbc_api_message);

    const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Authorization', 'Bearer ' + cbc_access_key + ':' + cbc_api_signature)
        .set('Couchbase-Timestamp', cbc_api_now)

    this.httpClient.post('https://cloudapi.cloud.couchbase.com/v2/projects',
        {name: projectName},
        {headers: headers});
  }

  async hmacSha256Hex(secret: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      algorithm,
      false, ["sign", "verify"]
    );
    const hashBuffer = await crypto.subtle.sign(
      algorithm.name,
      key,
      enc.encode(message)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(
      b => b.toString(16).padStart(2, '0')
    ).join('');
    return hashHex;
  }

  getProjects() {

  }
}
