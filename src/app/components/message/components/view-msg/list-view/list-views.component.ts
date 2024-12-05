import { DatePipe, NgClass, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CustomViewMessage, getColumnsViews, ViewMessage } from "@models/Message";
import { Column } from "@models/primeng";
import { Usuario } from "@models/Usuario";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-list-views',
  standalone: true,
  imports: [TableModule, NgIf, NgClass, DatePipe],
  templateUrl: './list-views.component.html',
  styles: [``]
})
export class ListViewsComponent implements OnInit {
  @Input() views: ViewMessage[] = [];
  cols: Column[] = getColumnsViews();
  private router = inject(Router);
  vws: CustomViewMessage[] = [];

  ngOnInit(): void {
    this.vws = this.views?.map((p) => new CustomViewMessage(p)) ?? [];
  }

  getPicture(user: Usuario) {
    return user?.profilePhoto?.url ?? null;
  }
}
