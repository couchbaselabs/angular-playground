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
    return this.httpClient.post('http://localhost:4201/v3/clusters', {
      "clusterName": clusterName,
      "environment": "hosted",
      "servers": [
        {
          "compute": "m5.xlarge",
          "size": 4,
          "services": [
            "data",
          ],
          "storage": {
            "size": 50,
            "IOPS": 3000,
            "type": "GP3"
          }
        },
        {
          "compute": "m5.xlarge",
          "size": 4,
          "services": [
            "index"
          ],
          "storage": {
            "size": 50,
            "IOPS": 3000,
            "type": "GP3"
          }
        }
      ],
      "supportPackage": {
        "timezone": "IST",
        "type": "DeveloperPro"
      },
      "description": "Example description of a G2 cluster",
      "place": {
        "singleAZ": true,
        "hosted": {
          "provider": "aws",
          "CIDR": "10.2.0.0/20",
          "region": "us-west-2"
        }
      },
      "projectId": "5de5f32b-866c-4a90-bafd-8bdaebb842cd"
    });
  }

  getClusters() {
    return this.httpClient.get('http://localhost:4201/v3/clusters');
  }

  deleteCluster(clusterId: string) {
    return this.httpClient.delete('http://localhost:4201/v3/clusters/' + clusterId);
  }
}
