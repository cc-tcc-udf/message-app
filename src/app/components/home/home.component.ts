import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { CourseService } from '@components/course/course.service';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { CustomMessage, getColumnsMsg, Message } from '@models/Message';
import { NewButtonComponent } from '@shared/new-button.component';
import { ListSkeletonComponent } from '@shared/skeletons/list-skeleton/list-skeleton.component';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { HomeListComponent } from './components/list-home.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeListComponent, DatePipe,
    DropdownModule, NewButtonComponent,
    NgIf, SkeletonModule, NgFor,
    ListSkeletonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  messages: CustomMessage[] = [];
  message: CustomMessage | null = null;
  courses: Course[] = [];
  cols = getColumnsMsg();
  user = this.auth.getUserFromSessionStorage();
  skeleton = {
    courses: true,
    all: true,
    messages: true,
    msg: true
  }

  constructor(
    private service: MessageService,
    private cr: ChangeDetectorRef,
    private courseService: CourseService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.user?.id) {
      const id = this.user?.id;
      this.getGroups(id);
      this.getAll(id);
    }
  }

  getAll(id: string) {
    this.skeleton.messages = true;
    this.service.getListById(id, 'resp')
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const msg = response.data as Message[];
          this.messages = msg.map(m => new CustomMessage(m));
          this.message = this.messages.length > 0 ? this.messages[0] : null;
          setTimeout(() => {
            this.skeleton = {
              all: false,
              courses: false,
              messages: false,
              msg: false
            }
            this.cr.detectChanges();
          }, 500)
        }
      });
  }

  getByCourse(id: string) {
    if (id) {
      this.skeleton.messages = true;
      this.service.getListById(id, 'course')
        .subscribe((response: GenericResponse) => {
          if (response.success) {
            const msg = response.data as Message[];
            this.messages = msg.map(m => new CustomMessage(m));
            this.message = this.messages.length > 0 ? this.messages[0] : null;
            setTimeout(() => {
              this.skeleton = {
                all: false,
                courses: false,
                messages: false,
                msg: false
              }
              this.cr.detectChanges();
            }, 500)
          }
        });
    } else {
      if (this.user?.id)
        this.getAll(this.user.id);
    }
  }

  getGroups(id: string) {
    this.courseService.getByResp(id)
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as Course[];
          this.courses = [...data.filter(c => !c.isGroup)];
        }
      });
  }
}
