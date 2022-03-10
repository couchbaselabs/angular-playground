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
    return this.httpClient.post('api/v2/projects',
        {name: projectName}).subscribe(
        (success) => {},
        (error) => {});
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
    return this.httpClient.get('api/v2/projects').subscribe(
      (success) => { debugger; let successMsg = JSON.parse(String(success))},
        (error) => {debugger; let errorMsg = JSON.parse(String(error))});
  }
}
