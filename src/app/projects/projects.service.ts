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


  createToken(clientKey: string, msg: string) {
    const key = new Buffer(clientKey, 'hex');
    return crypto.createHmac('sha256', key).update(msg).digest('hex');
  }

  addProject(projectName: string) {
    const time = new Date().getTime().toString();
    const token = 'ACCESS_KEY:' +
        this.createToken('SECRET_KEY', 'POST\n/v2/projects\n' + time);
    const headers= new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Authorization', 'Bearer ' + token)
        .set('Couchbase-Timestamp', time)

    this.httpClient.post('https://cloudapi.cloud.couchbase.com/v2/projects',
        {name: projectName},
        {headers: headers});
    // debugger

  }

  getProjects() {

  }
}
