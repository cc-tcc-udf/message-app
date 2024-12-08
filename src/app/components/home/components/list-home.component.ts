import { DatePipe, NgIf } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { CustomMessage, getColumnsMsg } from "@models/Message";
import { Column } from "@models/primeng";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-list-home',
  standalone: true,
  imports: [TableModule, NgIf, DatePipe],
  templateUrl: './list-home.component.html',
  styles: [``]
})
export class HomeListComponent {
  @Input() msgs: CustomMessage[] | null = [];
  cols: Column[] = getColumnsMsg();
  private router = inject(Router);

  view(msg: CustomMessage): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'home' } });
  }
}
