import { DatePipe, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
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
export class HomeListComponent implements OnInit {
  @Input() msgs: CustomMessage[] | null = [];
  cols: Column[] = getColumnsMsg();
  private router = inject(Router);

  ngOnInit(): void {
    console.log(this.msgs || []);
  }

  view(msg: CustomMessage): void {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: msg.id, rota: 'home' } });
  }
}
