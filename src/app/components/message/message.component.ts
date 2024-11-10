import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message } from '@models/Message';
import { NewButtonComponent } from '@shared/new-button.component';
import { TabViewModule } from 'primeng/tabview';
import { MessageListComponent } from "./components/message-list/message-list.component";
import { MessageService } from './message.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NewButtonComponent,
    TabViewModule, CommonModule,
    MessageListComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  tabs: { header: string, data: Message[] }[] = [
    { header: 'Todos', data: [] },
    { header: 'Enviadas', data: [] },
    { header: 'Não enviadas', data: [] },
  ];
  loadind: boolean = true;
  constructor(
    private service: MessageService, 
    private cr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  private getList() {
    this.service.getAllMessages()
      .subscribe((p) => {
        if (p.success) {
          const messages = p.data as Message[];
          this.tabs[0].data = messages;
          messages.forEach((item: Message) => {
            if (item.status === 'ENVIADO') {
              this.tabs[1].data.push(item);
            } else {
              this.tabs[2].data.push(item);
            }
          });
          this.loadind = false;
        } else {
          this.loadind = false;
        }
        this.cr.detectChanges();
      });
  }

}

