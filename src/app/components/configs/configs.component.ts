import { CommonModule } from '@angular/common';
import { Component, OnInit, Type } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CourseComponent } from "../course/course.component";
@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [
    CommonModule,
    CourseComponent,
    TabViewModule
  ],
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.scss',
})
export class ConfigsComponent implements OnInit {
  tabs: { header: string, component: Type<any> }[] = [];

  ngOnInit(): void {
    this.tabs = [
      { header: 'Cursos', component: CourseComponent }
    ];
  }
}
