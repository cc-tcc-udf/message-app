
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { CourseService } from '@components/course/course.service';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { CustomMessage, getColumnsMsg, Message } from '@models/Message';
import { Usuario } from '@models/Usuario';
import { NewButtonComponent } from '@shared/new-button.component';
import { ListSkeletonComponent } from '@shared/skeletons/list-skeleton/list-skeleton.component';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { HomeListComponent } from './components/list-home.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeListComponent,
    DropdownModule,
    NewButtonComponent,
    SkeletonModule,
    ListSkeletonComponent,
    FormsModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  messages: CustomMessage[] = [];
  message: CustomMessage | null = null;
  courses: Course[] = [];
  cols = getColumnsMsg();
  selectedCourseId: string | null = null;
  user!: Usuario;
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.user$
      .subscribe((p) => {
        if (p) {
          this.user = p;
          const id = p?.id;
          this.getGroups(id);
          this.getAll(id);
        }
      })
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

          if (this.courses.length === 1) {
            const singleCourseId = this.courses[0].id;
            this.selectedCourseId = singleCourseId;
            this.getByCourse(singleCourseId);
          }
        }
      });
  }

  view(id: string): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: id, rota: 'home' } });
  }
}
