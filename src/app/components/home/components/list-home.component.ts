import { DatePipe, NgIf } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "@components/message/message.service";
import { CustomMessage, getColumnsMsg } from "@models/Message";
import { Column } from "@models/primeng";
import { AlertService } from "@utils/services/alert.service";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: 'app-list-home',
  standalone: true,
  imports: [
    TableModule, NgIf,
    DatePipe, TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './list-home.component.html',
  styles: [``]
})
export class HomeListComponent {
  @Input() msgs: CustomMessage[] | null = [];
  cols: Column[] = getColumnsMsg();
  private router = inject(Router);
  constructor(
    private confirm: ConfirmationService,
    private alert: AlertService,
    private service: MessageService
  ) { }

  view(msg: CustomMessage): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'home' } });
  }

  disable(msg: CustomMessage): void {
    this.service.remove(msg.id).subscribe((resp) => {
      if (resp.success && this.msgs) {
        const index = this.msgs.findIndex((p) => p.id === msg.id);
        if (index !== -1) {
          this.msgs.splice(index, 1);
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
}
