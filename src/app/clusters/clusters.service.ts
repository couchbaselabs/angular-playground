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
    return this.httpClient.post('api/v3/clusters', { clusterName: clusterName });
  }

  getClusters() {
    return this.httpClient.get('api/v3/clusters');
  }

  deleteCluster(clusterId: string) {
    return this.httpClient.delete('api/v3/clusters/' + clusterId);
  }
}
