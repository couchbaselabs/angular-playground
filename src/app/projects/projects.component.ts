import {ChangeDetectionStrategy, Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  takeUntil,
  tap,
  timer
} from 'rxjs';
import {ProjectsService} from "./projects.service";

type Projects = Array<any> | null;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, OnDestroy {
  clickAddProject$: Subject<NgForm> = new Subject();
  clickDeleteProject$: Subject<NgForm> = new Subject();
  destroy$: Subject<boolean> = new Subject<boolean>();
  projects$: BehaviorSubject<Projects> = new BehaviorSubject<Projects>(null);
  projectName: string = '';
  fieldIsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  success$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private projectsService: ProjectsService) {
    this.projectsService = projectsService;

    this.projectsService
      .getProjectsPoller()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects:any) => {
        this.projects$.next(JSON.parse(projects).data);
      });
  }

  ngOnInit() {
    this.clickAddProject$
      .pipe(
        tap(() => this.fieldIsLoading$.next(true)),
        takeUntil(this.destroy$))
      .subscribe(this.addProject.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addProject(addProjectForm: NgForm) {
    this.projectsService
      .addProject(addProjectForm.value.projectName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.projectsService.updateProject.next(true);
        this.fieldIsLoading$.next(false);
        this.success$.next(true);
        this.error$.next(false);
        timer(2000).pipe(takeUntil(this.destroy$)).subscribe(() => this.success$.next(false));
      },() => {
        this.fieldIsLoading$.next(false);
        this.error$.next(true);
        this.success$.next(false);
        timer(2000).pipe(takeUntil(this.destroy$)).subscribe(() => this.error$.next(false));
      });
  }

  deleteProject(projectId: string) {
    this.projectsService
      .deleteProject(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.projectsService.updateProject.next(true));
  }
}
