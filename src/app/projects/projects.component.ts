import {ChangeDetectionStrategy, Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ProjectsService} from "./projects.service";

type Projects = Array<any> | null;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  projects$: BehaviorSubject<Projects> = new BehaviorSubject<Projects>(null);
  clickAddProject$: Subject<NgForm> = new Subject();
  projectName: string = '';

  constructor(private projectsService: ProjectsService) {
    this.projectsService = projectsService;

    this.projects$.subscribe(console.log)
  }

  ngOnInit() {
    this.clickAddProject$
    .pipe(takeUntil(this.destroy$))
    .subscribe(this.addProject.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getProjects() {
    this.projectsService.getProjects()
    .pipe(takeUntil(this.destroy$))
    .subscribe(projects => {
      this.projects$.next(JSON.parse(projects.toString()).data);
    });
  }

  addProject(addProjectForm: NgForm) {
    this.projectsService.addProject(addProjectForm.value.projectName)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }
}
