import { DatePipe, NgClass, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getColumnsViews, ViewMessage } from "@models/Message";
import { Column } from "@models/primeng";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-list-views',
  standalone: true,
  imports: [TableModule, NgIf, NgClass, DatePipe],
  templateUrl: './list-views.component.html',
  styles: [``]
})
export class ListViewsComponent implements OnInit {
  @Input() views: ViewMessage[] | null = [];
  cols: Column[] = getColumnsViews();
  private router = inject(Router);

  ngOnInit(): void {
    console.log(this.views || []);
  }
}
