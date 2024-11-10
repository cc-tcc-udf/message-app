import { Component, OnInit } from "@angular/core";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-list-home',
  standalone: true,
  imports: [TableModule],
  template: `
  <div class="flex h-full h-full align-items-center">
    <p class="font-bold text-6xl">Em construção</p>
    </div>
  `,
  styles: [``]
})
export class HomeListComponent implements OnInit {

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