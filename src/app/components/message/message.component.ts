import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MessageListComponent } from "./components/message-list/message-list.component";


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    TabViewModule, CommonModule,
    MessageListComponent, NgIf
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  tabs: { header: string, flag: string }[] = [
    { header: 'Todos', flag: 'all' },
    { header: 'Enviadas', flag: 'ENVIADO' },
    { header: 'Não enviadas', flag: 'NAO_ENVIADO' },
  ];
  selectedIndex: number = 0;
  onTabChange(index: number) {
    this.selectedIndex = index;
  }
}


