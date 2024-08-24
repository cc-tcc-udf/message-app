export class Table {
  name: string;
  property: string;

  constructor(table: Table) {
    this.name = table.name;
    this.property = table.property;
  }
}