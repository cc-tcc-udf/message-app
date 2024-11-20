import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { Message } from '@models/Message';
import { TabViewModule } from 'primeng/tabview';
import { MessageListComponent } from "./components/message-list/message-list.component";
import { MessageService } from './message.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
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
    private cr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((p) => {
      if (p?.id) {
        this.getList(p.id, this.auth.isAdmin())
      }
    })
  }

  private getList(id: string, isAdmin: boolean) {
    const s = isAdmin ? this.service.getAllMessages() : this.service.getAllByResp(id);
    s.subscribe((p) => {
      if (p.success) {
        const messages = p.data as Message[];
        this.tabs[0].data = messages;
        messages.forEach((item: Message) => {
          if (item.sendDate) {
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

