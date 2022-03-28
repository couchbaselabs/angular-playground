import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClustersService {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  addCluster(clusterName: string) {
    return this.httpClient.post('http://localhost:4201/v3/clusters', { clusterName: clusterName });
  }

  getClusters() {
    return this.httpClient.get('http://localhost:4201/v3/clusters');
  }

  deleteCluster(clusterId: string) {
    return this.httpClient.delete('http://localhost:4201/v3/clusters/' + clusterId);
  }
}
