import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products!: unknown[];

  ngOnInit(): void {
    this.products = [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
    ];
  }

}
