import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { GenericResponse, PaginatedModel } from '@models/GenericResponse';
import { CustomMessage, getMessagecolumns, Message } from '@models/Message';
import { PageableDTO } from '@models/pageable';
import { Column } from '@models/primeng';
import { Usuario } from '@models/Usuario';
import { NewButtonComponent } from '@shared/new-button.component';
import { ListSkeletonComponent } from '@shared/skeletons/list-skeleton/list-skeleton.component';
import { AlertService } from '@utils/services/alert.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from './message.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ConfirmDialogModule, TableModule,
    NewButtonComponent, IconFieldModule, NgFor,
    InputIconModule, DropdownModule, NgIf,
    FormsModule, NgClass, ListSkeletonComponent,
    InputTextModule, TooltipModule, SkeletonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit {
  totalRecords = 0;
  message: CustomMessage[] = [];
  cols = getMessagecolumns();
  skeleton = { all: true, load: true };
  statuses = [
    { label: 'Enviado', value: 'Enviado', original: 'ENVIADO' },
    { label: 'Não enviado', value: 'Não enviado', original: 'NAO_ENVIADO' },
    { label: 'Removida', value: 'Removida', original: 'REMOVIDA' },
  ];
  user!: Usuario;
  constructor(
    private service: MessageService,
    private router: Router,
    private alert: AlertService,
    private confirm: ConfirmationService,
    private auth: AuthService,
    private cr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.service.getAllMessages()
    //   .subscribe((response) => {
    //     this.skeleton.all = false;
    //     if (response.success) {
    //       this.message = (response.data as Message[]).map((p) => new CustomMessage(p));
    //       this.totalRecords = this.message.length;
    //       this.skeleton.load = false;
    //     }
    //   });
    this.auth.user$.subscribe((p) => {
      if (p) {
        this.user = p;
        this.skeleton.all = false;
      }
    });
  }

  load($event: TableLazyLoadEvent): void {
    this.skeleton.load = true;
    const isAdmin = this.auth.isAdmin();
    const page: PageableDTO = {
      ...$event as PageableDTO,
      objectId: isAdmin ? undefined : this.user.id
    };
    this.service.getPageable(page)
      .subscribe((response: GenericResponse | null) => {
        if (response?.success) {
          const data = response.data as PaginatedModel;
          console.log(data);
          this.totalRecords = data?.totalElements;
          this.message = (data.content as Message[]).map((p) => new CustomMessage(p));
          setTimeout(() => {
            console.log(this.message)
            this.skeleton.load = false;
          }, 500)
          // if (data?.content) {
          //   const msgs: Message[] = data.content as Message[];
          //   this.message = msgs as unknown as CustomMessage[]
          //   this.totalRecords = data.totalElements;
          //   this.cr.detectChanges()
          // } else {
          //   console.warn('Conteúdo vazio na resposta');
          //   this.message = [];
          //   this.totalRecords = 0;
          // }
        } else {
          console.error('Falha na resposta da requisição', response);
          this.message = [];
          this.totalRecords = 0;
        }
        this.skeleton.load = false;
      });
  }

  getFields(): string[] {
    return this.cols.map((col) => col.field);
  }

  getClass(msg: CustomMessage, col: Column): string {
    let classList = '';

    if (col.isTag) {
      classList += 'tag ';
    }

    if (col.isTag && col.field === 'custom_status') {
      classList += msg.status + ' text-sm';
    }

    if (col.field === 'courses') {
      classList += 'RECEBIDO text-sm';
    }

    return classList.trim();
  }
  disable(msg: CustomMessage): void {
    this.service.remove(msg.id).subscribe((resp) => {
      if (resp.success && this.message) {
        const index = this.message.findIndex((p) => p.id === msg.id);
        if (index !== -1) {
          const m = new CustomMessage(resp.data as Message);
          m.removing = false;
          this.message[index] = m;
        }
        this.alert.showMsg('success', 'Message', 'Messagem desabilitado com sucesso!');
      } else {
        this.alert.showMsg('error', 'Message', 'Erro ao desabilitado a messagem!');
      }
    });
  }

  remove(msg: CustomMessage) {
    msg.removing = true;
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
      reject: () => {
        msg.removing = false;
      }
    });
  }

  edit(msg: CustomMessage): void {
    this.router.navigate(['msg', 'msg-manage'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  view(msg: CustomMessage): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  send(msg: CustomMessage): void {
    msg.sending = true;
    this.service.sendById(msg.id).subscribe({
      next: (res) => {
        if (res.success) {
          const index = this.message?.findIndex((p) => p.id === msg.id) ?? -1;
          if (index >= 0) {
            this.message[index] = new CustomMessage(res.data as Message);
            this.alert.showMsg('success', 'Envio', 'Mensagem enviada com sucesso!');
          }
        } else {
          this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!');
        }
        msg.sending = false;
      },
      error: (err) => {
        msg.sending = false;
        this.alert.showMsg('error', 'Envio', 'Erro ao enviar mensagem, tente novamente mais tarde!' + err);
      }
    });
  }
}


