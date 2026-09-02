import { CustomUsuario, Usuario } from "./Usuario";

export class Course {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  resp: Usuario;
  courseGroupId: string;
  isGroup: boolean;
  courses?: SubCourse[];

  constructor(obj: Course) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
    this.resp = obj.resp;
    this.courses = obj.courses?.map(sub => new SubCourse(sub));
  }
}
export class CourseCustom {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  resp?: CustomUsuario;
  courseGroupId: string;
  isGroup: boolean;
  courses?: SubCourse[];

  constructor(obj: Course) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
    if (obj.resp && obj.resp?.id)
      this.resp = new CustomUsuario(obj.resp);
    this.courses = obj.courses?.map(sub => new SubCourse(sub));
  }
}


export class SubCourse {
  id?: string | null;
  name?: string;
  description?: string;
  abbreviation?: string;
  resp?: Usuario;
  courseGroupId?: string;
  isGroup?: boolean;
  siglaGroup?: string

  constructor(obj: SubCourse) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    this.resp = obj.resp;
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
    this.siglaGroup = obj.siglaGroup
  }
}

export class SubCourseCustom {
  id?: string | null;
  name?: string;
  description?: string;
  abbreviation?: string;
  resp?: CustomUsuario;
  courseGroupId?: string;
  isGroup?: boolean;
  siglaGroup?: string

  constructor(obj: SubCourse) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.abbreviation = obj.abbreviation;
    if (obj.resp && obj.resp?.id)
      this.resp = new CustomUsuario(obj.resp);
    this.courseGroupId = obj.courseGroupId;
    this.isGroup = obj.isGroup;
    this.siglaGroup = obj.siglaGroup
  }
}

export function getCourseCols() {
  return [
    { field: 'name', header: 'Nome' },
    { field: 'description', header: 'Descrição' },
    { field: 'resp', header: 'Responsável', isImg: true },
    { field: 'abbreviation', header: 'Sigla', isTag: true },
    { field: 'isGroup', header: 'Grupo', isBoolean: true },
    { field: 'qtdCursos', header: 'Qtd Cursos' },
  ]
}
export function getSubCourseCols() {
  return [
    { field: 'name', header: 'Nome' },
    { field: 'description', header: 'Descrição' },
    { field: 'abbreviation', header: 'Sigla', isTag: true },
    // { field: 'siglaGroup', header: 'Sigla grupo', isTag: true },
    // { field: 'isGroup', header: 'Grupo', isBoolean: true }
  ]
}
