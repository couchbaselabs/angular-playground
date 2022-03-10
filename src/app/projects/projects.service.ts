import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  addProject(projectName: string) {
    return this.httpClient.post('api/v2/projects', { Name: projectName });
  }

  getProjects() {
    return this.httpClient.get('api/v2/projects');
  }

  deleteProject(projectId: string) {
    return this.httpClient.delete('api/v2/projects/' + projectId);
  }
}
