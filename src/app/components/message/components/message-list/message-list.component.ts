import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { getMessagecolumns, Message } from '@models/Message';
import { Column } from '@models/primeng';
import { Status } from '@models/Status';
import { InputComponent } from '@shared/input.component';
import { NewButtonComponent } from '@shared/new-button.component';
import { customDate } from '@utils/date.formate';
import { AlertService } from '@utils/services/alert.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass,
    TableModule, CommonModule,
    InputComponent, NewButtonComponent,
    ConfirmDialogModule
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageListComponent implements OnInit {
  @Input() data!: Message[];
  cols: Column[] = getMessagecolumns();
  private router = inject(Router);
  private msgService = inject(MessageService);
  private alert = inject(AlertService);

  ngOnInit(): void {
    console.log(this.data);
  }

  send(msg: Message): void {
    this.msgService.send(msg).subscribe({
      next: (res) => {
        if (res.success) {
          const index = this.data.findIndex((p) => p.id === msg.id);
          if (index >= 0) {
            this.data[index] = res.data as Message;
            this.alert.showMsg('success', 'Envio', 'Mensagem enviada com sucesso!');
          } else {
            this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!');
          }
        }
      },
      error: (err) => {
        this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!' + err);
      }
    });
  }

  edit(msg: Message): void {
    this.router.navigate(['msg', 'msg-manage'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  view(msg: Message): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  getClassTag(msg: Message): string {
    return msg.sendDate ? '' : `tag ${msg.status}`;
  }

  getTxt(msg: Message, isDate?: boolean): string | Date {
    return isDate && msg.sendDate ? customDate(msg.sendDate) : this.getStatus(msg.status);
  }

  getFields(): string[] {
    return this.cols.map(col => col.field);
  }

  getCourse(courses: Course[]): string {
    return courses.map(course => course.abbreviation).join('/');
  }

  getStatus(s: string): string {
    return Status[s as keyof typeof Status];
  }

  getActions(msg: Message) {
    const actions = [
      { label: 'Visualizar', class: 'view default add', icon: 'bi bi-eye', method: this.view.bind(this) },
      { label: 'Editar', class: 'edit default add', icon: 'bi bi-pencil', method: this.edit.bind(this) },
    ]
    if (msg.courses.length > 0 && !msg.sendDate) {
      actions.push({ label: 'Enviar', class: 'send default add', icon: 'bi bi-send', method: this.send.bind(this) })
    }
    return actions;
  }
}
