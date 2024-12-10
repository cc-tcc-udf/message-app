import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MessageListComponent } from '../../message-list/message-list.component';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    TabViewModule, CommonModule,
    MessageListComponent, NgIf,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent {
  selectedIndex: number = 0;
  onTabChange(index: number) {
    this.selectedIndex = index;
  }
}


