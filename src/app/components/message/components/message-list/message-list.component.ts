import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { GenericResponse, PaginatedModel } from '@models/GenericResponse';
import { getMessagecolumns, Message } from '@models/Message';
import { PageableDTO } from '@models/pageable';
import { Column } from '@models/primeng';
import { Status } from '@models/Status';
import { Usuario } from '@models/Usuario';
import { InputComponent } from '@shared/input.component';
import { NewButtonComponent } from '@shared/new-button.component';
import { customDate } from '@utils/date.formate';
import { AlertService } from '@utils/services/alert.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass,
    TableModule, CommonModule,
    InputComponent, NewButtonComponent,
    ConfirmDialogModule, TooltipModule
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageListComponent implements OnInit {
  totalRecords: number = 0;
  loading: boolean = true;
  @Input() flag: string = 'all';
  value: Message[] = [];
  cols: Column[] = getMessagecolumns();
  private router = inject(Router);
  private service = inject(MessageService);
  private alert = inject(AlertService);
  private auth = inject(AuthService);
  private confirm = inject(ConfirmationService);

  user!: Usuario;
  skeleton = {
    send: false
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((p) => {
      if (p) {
        this.user = p;
      }
    });
  }

  load($event: TableLazyLoadEvent) {
    const isAdmin = this.auth.isAdmin();
    const page = $event as PageableDTO;
    page.objectId = isAdmin ? undefined : this.user.id;
    page.flag = this.flag;
    console.log(page)
    this.loading = true;
    this.service.getPageable(page)
      .subscribe((response: GenericResponse) => {
        if (response) {
          const data = response.data as PaginatedModel;
          console.log(data);
          this.totalRecords = data?.totalElements;
          this.value = data?.content as Message[];
          this.loading = false;
        }
      })
  }

  send(msg: Message): void {
    this.skeleton.send = true;
    this.service.send(msg).subscribe({
      next: (res) => {
        if (res.success) {
          const index = this.value?.findIndex((p) => p.id === msg.id) ?? -1;
          if (index >= 0) {
            this.value[index] = res.data as Message;
            this.alert.showMsg('success', 'Envio', 'Mensagem enviada com sucesso!');
          }
        } else {
          this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!');
        }
        this.skeleton.send = false;
      },
      error: (err) => {
        this.skeleton.send = false;
        this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!' + err);
      }
    });
  }

  disable(msg: Message): void {
    this.service.remove(msg.id).subscribe((resp) => {
      if (resp.success && this.value) {
        const index = this.value.findIndex((p) => p.id === msg.id);
        if (index !== -1) {
          this.value.splice(index, 1);
        }
        this.alert.showMsg('success', 'Message', 'Messagem desabilitado com sucesso!');
      } else {
        this.alert.showMsg('error', 'Message', 'Erro ao desabilitado a messagem!');
      }
    });
  }

  remove(msg: Message) {
    this.confirm.confirm({
      header: 'Desativar mensagem',
      message: 'Ao continuar, a mensagem será desativada e inacessível ao aluno. Esta ação é irreversível. ',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: "Não",
      acceptLabel: "Sim",

      accept: () => {
        this.disable(msg);
      },
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

  getActions() {
    return [
      { label: 'Visualizar', class: 'view default add', icon: 'bi bi-eye', method: (msg: Message) => this.view(msg) },
      { label: 'Editar', class: 'edit default add', icon: 'bi bi-pencil', method: (msg: Message) => this.edit(msg) },
    ];
  }

}
