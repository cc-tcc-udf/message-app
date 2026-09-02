import { PageableDTO } from "./pageable";

export class GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  pageable?: PageableDTO
  data?: T;

  constructor(obj: GenericResponse<T>) {
    this.success = obj.success;
    this.message = obj.message;
    this.pageable = obj.pageable;
    this.data = obj.data;
  }
}


export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedModel<T = unknown> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}
