import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@components/message/message.service';
import { CustomMessage, getMessagecolumns, Message } from '@models/Message';
import { Column } from '@models/primeng';
import { NewButtonComponent } from '@shared/new-button.component';
import { AlertService } from '@utils/services/alert.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    TableModule, IconFieldModule, InputTextModule, ConfirmDialogModule,
    InputIconModule, MultiSelectModule, DropdownModule,
    FormsModule, NgClass, NgFor, NgIf, NewButtonComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MessageListComponent implements OnInit {
  totalRecords = 0;
  message: CustomMessage[] = [];
  cols = getMessagecolumns();
  skeleton = { send: false, load: true };
  @Input() flag: string = 'all';
  statuses = [
    { label: 'Enviado', value: 'Enviado', original: 'ENVIADO' },
    { label: 'Não enviado', value: 'Não enviado', original: 'NAO_ENVIADO' },
    { label: 'Removida', value: 'Removida', original: 'REMOVIDA' },
  ];

  constructor(
    private service: MessageService,
    private router: Router,
    private alert: AlertService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.service.getAllMessages().subscribe((response) => {
      if (response.success) {
        this.message = (response.data as Message[]).map((p) => new CustomMessage(p));
        this.totalRecords = this.message.length;
        this.skeleton.load = false;
      }
    });
  }

  load(event: TableLazyLoadEvent): void {
    console.log(event);
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
          if (this.flag === 'ENVIADO') {
            this.message.splice(index, 1);
          }
          if (this.flag === 'all') {
            this.message[index] = new CustomMessage(resp.data as Message);
          }
        }
        this.alert.showMsg('success', 'Message', 'Messagem desabilitado com sucesso!');
      } else {
        this.alert.showMsg('error', 'Message', 'Erro ao desabilitado a messagem!');
      }
    });
  }

  remove(msg: CustomMessage) {
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
