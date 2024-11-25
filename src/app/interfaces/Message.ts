import { Course } from "./Course";
import { FileApp } from "./File";
import { Links } from "./Links";
import { Status } from "./Status";

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
  }
}

export class CustomMessage {
  id: string;
  title: string;
  summary?: string;
  sendDate?: string;
  status: Status;
  message: string;
  courses: String;
  responsible: string;
  attachments?: FileApp[];
  links?: Links[];
  views: Number;

  constructor(msg: Message) {
    this.id = msg.id;
    this.title = msg.title;
    this.summary = msg.summary;
    this.status = msg.status;
    this.sendDate = msg.sendDate;
    this.message = msg.message;
    this.responsible = msg.responsible;
    this.attachments = msg.attachments;
    this.links = msg.links;
    this.courses = msg.courses.map(course => course.abbreviation).join('/');
    this.views = 0;
  }
}

export function getCommonColumns() {
  return [
    { field: 'title', header: 'Titulo' },
    { field: 'sendDate', header: 'Data Envio', isDate: true },
    { field: 'courses', header: 'Cursos', isTag: true },
  ];
}

export function getMessagecolumns() {
  return [
    ...getCommonColumns(),
    { field: 'status', header: 'Status', isTag: true, isStatus: true },
    { field: 'views', header: 'Visualizações' },
  ];
}

export function getColumnsMsg() {
  return [
    ...getCommonColumns(),
    { field: 'views', header: 'Visualizações' },
  ];
}

