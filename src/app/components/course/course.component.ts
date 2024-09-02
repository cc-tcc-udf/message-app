import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Course, getCourseCols, getSubCourseCols } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { Column } from '@models/primeng';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    TableModule, NgClass,
    ButtonModule, NgIf,
    DialogModule
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  cols: Column[] = getCourseCols();
  colsSub: Column[] = getSubCourseCols();
  private service = inject(CourseService);

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.service.getAllCourses(true).
      subscribe((obj: GenericResponse) => {
        this.courses = obj.data as Course[];
        console.log(this.courses);
      });
  }

  newCourse() {
  }
}
