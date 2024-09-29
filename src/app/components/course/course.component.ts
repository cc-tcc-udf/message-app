import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Course, CourseCustom, getCourseCols, getSubCourseCols, SubCourse } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { Column } from '@models/primeng';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ModalCourseComponent } from './components/modal-course.component';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    TableModule, NgClass,
    ButtonModule, NgIf,
    DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CourseComponent implements OnInit {
  courses: CourseCustom[] = [];
  cols: Column[] = getCourseCols();
  colsSub: Column[] = getSubCourseCols();

  private service = inject(CourseService);
  private dialogService = inject(DialogService);
  private cr = inject(ChangeDetectorRef);


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
        console.log(this.courses);
        this.loading = false;
        this.cr.detectChanges();
      });
  }

  newCourse(obj?: Course | SubCourse) {
    this.ref = this.dialogService.open(
      ModalCourseComponent, {
      header: 'Cadastrar novo curso',
      contentStyle: { overflow: 'auto' },
      data: {
        data: obj
      }
    }
    )
    this.ref.onClose.subscribe((p) => {
      if (p) {
        this.getData();
      }
    })
  }
}
