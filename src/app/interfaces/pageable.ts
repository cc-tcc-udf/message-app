export class PageableDTO {
  first: number | undefined;
  rows: number | undefined;
  sortField?: string;
  sortOrder?: number;
  total?: number;
  filters?: unknown;
  globalFilter?: string;
  objectId?: string;
  flag?: string;


  constructor(init?: Partial<PageableDTO>) {
    Object.assign(this, init);
  }
}
