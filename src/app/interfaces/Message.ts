import { customDate } from "@utils/date.formate";
import { Course } from "./Course";
import { FileApp } from "./File";
import { Links } from "./Links";
import { Status } from "./Status";
import { Usuario } from "./Usuario";

export class Message {
  id: string;
  title: string;
  summary: string;
  sendDate: string;
  status: Status;
  message: string;
  courses: Course[];
  responsible: string;
  attachments: FileApp[];
  links: Links[];
  vlrViews: string;
  constructor(msg: Message) {
    this.id = msg.id;
    this.title = msg.title;
    this.summary = msg.summary;
    this.sendDate = msg.sendDate;
    this.status = msg.status;
    this.message = msg.message;
    this.responsible = msg.responsible;
    this.attachments = msg.attachments;
    this.links = msg.links;
    this.courses = msg.courses;
    this.vlrViews = msg.vlrViews;
  }
}

export class CustomMessage {
  id: string;
  title: string;
  summary?: string;
  sendDate?: string;
  status: Status;
  custom_status: string;
  message: string;
  courses: string;
  responsible: string;
  attachments?: FileApp[];
  links?: Links[];
  vlrViews: string;
  sending: boolean;

  constructor(msg: Message) {
    this.id = msg.id;
    this.title = msg.title;
    this.summary = msg.summary;
    this.status = msg.status;
    this.custom_status = this.getStatus(msg.status);
    this.sendDate = msg.sendDate ? customDate(msg.sendDate) : '-';
    this.message = msg.message;
    this.responsible = msg.responsible;
    this.attachments = msg.attachments;
    this.links = msg.links;
    this.courses = msg.courses.map(course => course.abbreviation).join('/');
    this.vlrViews = msg.vlrViews;
    this.sending = false;
  }

  getStatus(s: string): string {
    return Status[s as keyof typeof Status];
  }
}

export class ViewMessage {
  id: string;
  favorite: boolean;
  message: Message;
  received: boolean;
  user: Usuario;
  viewDate: string;
  viewed: boolean;
  course: string;

  constructor(vw: ViewMessage) {
    this.id = vw.id;
    this.favorite = vw.favorite;
    this.message = vw.message;
    this.received = vw.received;
    this.user = vw.user;
    this.viewDate = vw.viewDate;
    this.viewed = vw.viewed;
    this.course = vw.course;
  }
}
export class CustomViewMessage {
  id: string;
  favorite: boolean;
  message: Message;
  received: boolean;
  user: Usuario;
  photo: string;
  email: string;
  viewDate: string;
  viewed: string;
  course: string;

  constructor(vw: ViewMessage) {
    this.id = vw.id;
    this.favorite = vw.favorite;
    this.message = vw.message;
    this.received = vw.received;
    this.user = vw.user;
    this.viewDate = vw.viewDate;
    this.viewed = vw.viewed ? 'Sim' : 'Não';
    this.photo = vw?.user?.profilePhoto?.url ?? null;
    this.course = vw.course;
    this.email = vw?.user?.email ?? null;

  }
}


export function getCommonColumns() {
  return [
    { field: 'title', header: 'Assunto' },
    { field: 'sendDate', header: 'Data Envio', isDate: true },
    { field: 'courses', header: 'Cursos', isTag: true },
  ];
}

export function getMessagecolumns() {
  return [
    ...getCommonColumns(),
    { field: 'custom_status', header: 'Status', isTag: true, isStatus: true },
    { field: 'vlrViews', header: 'Visualizações' },
  ];
}

export function getColumnsMsg() {
  return [
    ...getCommonColumns(),
    { field: 'vlrViews', header: 'Visualizações' },
  ];
}
export function getColumnsViews() {
  return [
    { field: 'user', header: 'Aluno', isUser: true },
    { field: 'email', header: 'Email', isTag: true },
    { field: 'course', header: 'Curso', isTag: true },
    { field: 'viewDate', header: 'Data de visualização', isDate: true },
  ];
}

