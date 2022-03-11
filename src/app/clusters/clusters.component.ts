import {ChangeDetectionStrategy, Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ClustersService} from "./clusters.service";

type Clusters = Array<any> | null;

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClustersComponent implements OnInit, OnDestroy {
  clickAddCluster$: Subject<NgForm> = new Subject();
  clickDeleteCluster$: Subject<NgForm> = new Subject();
  destroy$: Subject<boolean> = new Subject<boolean>();
  clusters$: BehaviorSubject<Clusters> = new BehaviorSubject<Clusters>(null);
  clusterName: string = '';

  constructor(private clustersService: ClustersService) {
    this.clustersService = clustersService;

    this.clustersService.getClusters()
    .pipe(takeUntil(this.destroy$))
    .subscribe(clusters => {
      this.clusters$.next(JSON.parse(clusters.toString()).data.items);
    });
  }

  ngOnInit() {
    this.clickAddCluster$
    .pipe(takeUntil(this.destroy$))
    .subscribe(this.addCluster.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addCluster(addClusterForm: NgForm) {
    this.clustersService.addCluster(addClusterForm.value.clusterName)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  deleteCluster(clusterId: string) {
    this.clustersService.deleteCluster(clusterId)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }
}
