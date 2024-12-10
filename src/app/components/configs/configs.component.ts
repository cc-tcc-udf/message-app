import { CommonModule } from '@angular/common';
import { Component, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { UsersComponent } from '@components/users/users.component';
import { TabViewModule } from 'primeng/tabview';
import { CourseComponent } from "../course/course.component";
@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule
  ],
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ConfigsComponent implements OnInit {
  tabs: { header: string, component: Type<unknown> }[] = [];

  ngOnInit(): void {
    this.tabs = [
      { header: 'Cursos', component: CourseComponent },
      { header: 'Usuarios', component: UsersComponent },
    ];
  }
}
