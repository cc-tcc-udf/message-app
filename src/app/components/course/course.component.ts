import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Course, CourseCustom, getCourseCols, getSubCourseCols, SubCourse } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { Column } from '@models/primeng';
import { ListSkeletonComponent } from '@shared/skeletons/list-skeleton/list-skeleton.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ModalCourseComponent } from './components/modal/modal-course.component';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    TableModule, NgClass,
    ButtonModule, NgIf,
    DynamicDialogModule,
    ListSkeletonComponent,
    SkeletonModule, SlicePipe
  ],
  viewProviders: [DialogService],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class CourseComponent implements OnInit {
  courses: CourseCustom[] = [];
  cols: Column[] = getCourseCols();
  colsSub: Column[] = getSubCourseCols();

  private service = inject(CourseService);
  private dialogService = inject(DialogService);
  private cr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ref: DynamicDialogRef | undefined;
  loading: boolean = true;

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.service.getAllCourses(true).
      subscribe((obj: GenericResponse) => {
        this.courses = (obj.data as Course[])
          .map(course => new CourseCustom(course));
        this.loading = false;
        this.cr.detectChanges();
      });
  }
  newCourse(obj?: Course | SubCourse) {
    this.ref = this.dialogService.open(
      ModalCourseComponent, {
      header: obj ? 'Editar' : 'Cadastrar',
      contentStyle: { overflow: 'auto' },
      data: {
        data: obj
      }
    })

    this.ref.onClose.subscribe((p) => {
      if (p) {
        this.getData();
      }
    })
  }

  view(course: CourseCustom) {
    this.router.navigate(['courses', 'view'], { queryParams: { id: course.id, rota: 'courses' } });
  }
}
