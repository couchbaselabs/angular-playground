import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsService } from './projects/projects.service';
import { ClustersComponent } from './clusters/clusters.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddProjectComponent,
    ProjectsComponent,
    ClustersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    ProjectsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
