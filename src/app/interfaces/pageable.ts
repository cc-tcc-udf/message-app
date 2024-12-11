// export class PageableDTO {
//   first: number | undefined;
//   rows: number | undefined;
//   sortField?: string;
//   sortOrder?: number;
//   total?: number;
//   filters?: unknown;
//   globalFilter?: string;
//   objectId?: string;
//   flag?: string;


//   constructor(init?: Partial<PageableDTO>) {
//     Object.assign(this, init);
//   }
// }

export class FilterDTO<T = unknown> {
  value: T;
  matchMode: string;
  constructor(f: FilterDTO<T>) {
    this.value = f.value;
    this.matchMode = f.matchMode;
  }
}

export class PageableDTO {
  first: number | undefined;
  rows: number | undefined;                        // Número de registros por página
  sortField?: string;                    // Campo para ordenação (opcional)
  sortOrder?: 1 | -1;                    // Ordem (1 para ascendente, -1 para descendente)
  globalFilter?: string;                 // Filtro global (opcional)
  filters?: Record<string, FilterDTO>;   // Filtros dinâmicos
  objectId?: string;

  constructor(init?: Partial<PageableDTO>) {
    Object.assign(this, init);
  }
}

