import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, combineLatest, BehaviorSubject} from 'rxjs';
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  updateProject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  addProject(projectName: string) {
    return this.httpClient.post('https://cloudapi.cloud.couchbase.com/v2/projects', { name: projectName });
  }

  getProjects() {
    return this.httpClient.get('https://cloudapi.cloud.couchbase.com/v2/projects');
  }

  getProjectsPoller() {
    return combineLatest(timer(0, 4000),
                         this.updateProject)
        .pipe(switchMap(_ => this.getProjects()));
  }

  deleteProject(projectId: string) {
    return this.httpClient.delete('https://cloudapi.cloud.couchbase.com/v2/projects/' + projectId);
  }
}
