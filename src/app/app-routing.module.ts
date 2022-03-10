import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ClustersComponent } from './clusters/clusters.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'clusters', component: ClustersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
