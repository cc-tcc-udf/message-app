import { Component, OnInit } from "@angular/core";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-list-home',
  standalone: true,
  imports: [TableModule],
  template: `
  <div class="card">
      <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.quantity }}</td>
          </tr>
        </ng-template>
      </p-table>
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