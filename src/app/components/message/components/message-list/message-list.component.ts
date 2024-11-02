import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { getMessageColuns, Message } from "@models/Message";
import { Column } from "@models/primeng";
import { Status } from "@models/Status";
import { InputComponent } from "@shared/input.component";
import { NewButtonComponent } from "@shared/new-button.component";
import { customDate } from "@utils/date.formate";
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass,
    TableModule, CommonModule,
    InputComponent, NewButtonComponent
  ],
  providers: [],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MessageListComponent implements OnInit {
  @Input() data!: Message[];
  cols: Column[] = getMessageColuns();
  private router = inject(Router);

  actions = [
    { label: 'alterar curso', class: 'view', icon: 'bi bi-eye', method: this.view.bind(this) },
    { label: 'editar curso', class: 'edit', icon: 'bi bi-pencil', method: this.edit.bind(this) },
    { label: 'enviar curso', class: 'send', icon: 'bi bi-send', method: this.send.bind(this) }
  ];

  ngOnInit(): void {
    console.log(this.data)
  }


  send(msg: Message) {
    console.log(msg);
  }

  edit(msg: Message) {
    this.router.navigate(['msg', 'msg-manage'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  view(msg: Message) {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'msg' } });
  }

  navigate(msg: Message, rota: string) {
    this.router.navigate(['msg', rota], { queryParams: { id: msg.id, rota: 'msg' } });
  }
  getClassTag(msg: Message, isDate?: boolean): string {
    if (isDate && msg.status !== 'NAO_ENVIADO') {
      return '';
    }


    return 'tag ' + msg.status;
  }

  getTxt(msg: Message, isDate?: boolean): string | Date {
    if (isDate && msg.status !== 'NAO_ENVIADO') {
      return customDate(msg.sendDate);
    }
    return Status[msg.status as keyof typeof Status];
  }

  getFields() {
    return this.cols.map(col => col.field);
  }
}
