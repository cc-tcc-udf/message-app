import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Course, getCourseCols, getSubCourseCols, SubCourse } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { Column } from '@models/primeng';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
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
    DialogModule, DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  cols: Column[] = getCourseCols();
  colsSub: Column[] = getSubCourseCols();
  private service = inject(CourseService);
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  loading: boolean = true;

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.service.getAllCourses(true).
      subscribe((obj: GenericResponse) => {
        const data = obj.data as Course[];
        this.courses = data.sort((a, b) => a.id - b.id);
        console.log(this.courses);
        setTimeout(() => {
          this.loading = false;
        }, 500)
      });
  }

  newCourse(obj?: Course | SubCourse) {
    this.ref = this.dialogService.open(
      ModalCourseComponent, {
      header: 'Cadastrar novo curso',
      position: 'bottom',
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
