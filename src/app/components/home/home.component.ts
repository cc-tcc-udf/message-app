import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { CourseService } from '@components/course/course.service';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { CustomMessage, Message } from '@models/Message';
import { DropdownModule } from 'primeng/dropdown';
import { HomeListComponent } from './components/list-home.component';
import { NewButtonComponent } from "../../shared/new-button.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeListComponent, DatePipe, DropdownModule, NewButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  messages: CustomMessage[] = [];
  message: CustomMessage | null = null;
  courses: Course[] = [];
  user = this.auth.getUserFromSessionStorage();
  constructor(
    private service: MessageService,
    private cr: ChangeDetectorRef,
    private courseService: CourseService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.user?.id) {
      this.getGroups(this.user?.id);
    }
    this.service.getAllMessages()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const msg = response.data as Message[];
          this.messages = msg.map(m => new CustomMessage(m));
          this.message = this.messages.length > 0 ? this.messages[0] : null;
          this.cr.detectChanges();
        }
      });
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
