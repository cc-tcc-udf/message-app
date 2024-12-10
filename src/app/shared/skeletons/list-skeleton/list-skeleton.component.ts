import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { Column } from '@models/primeng';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-list-skeleton',
  standalone: true,
  imports: [SkeletonModule, TableModule, NgIf, NgFor],
  templateUrl: './list-skeleton.component.html',
  styleUrl: './list-skeleton.component.scss'
})
export class ListSkeletonComponent implements OnInit {
  @Optional() @Input() qtd: number | null = null;
  @Optional() @Input() qtdValues: number = 5;
  @Input() col: unknown[] = [];
  cols: Column[] | null = null;
  values: string[] = [];

  ngOnInit(): void {
    if (this.col) {
      this.cols = this.col as Column[];
    }

    this.values = Array.from({ length: this.qtdValues }).map((_, i) => `Item #${i}`);
  }
}
