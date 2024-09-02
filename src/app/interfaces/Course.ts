export class Course {
  id: number;
  name: string;
  description: string;
  abbreviation: string;
  resp: number;
  courseGroupId: number;
  isGroup: boolean;
  courses?: SubCourse[];

  constructor(obj: Course) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    this.resp = obj.resp;
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
    this.courses = obj.courses?.map(sub => new SubCourse(sub));
  }
}

export class SubCourse {
  id: number;
  name: string;
  description: string;
  abbreviation: string;
  resp: number;
  courseGroupId: number;
  isGroup: boolean;

  constructor(obj: SubCourse) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    this.resp = obj.resp;
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
  }
}


export function getCourseCols() {
  return [
    { field: 'id', header: 'id' },
    { field: 'name', header: 'Nome' },
    { field: 'description', header: 'Descrição' },
    { field: 'abbreviation', header: 'Sigla', isTag: true },
    { field: 'isGroup', header: 'Grupo', isBoolean: true },
    // { field: 'action', header: 'Ações', isAction: true },
  ]
}
export function getSubCourseCols() {
  return [
    { field: 'id', header: 'id' },
    { field: 'name', header: 'Nome' },
    { field: 'description', header: 'Descrição' },
    { field: 'abbreviation', header: 'Sigla', isTag: true },
    { field: 'siglaGroup', header: 'Sigla grupo', isTag: true },
    { field: 'isGroup', header: 'Grupo', isBoolean: true }
  ]
}
