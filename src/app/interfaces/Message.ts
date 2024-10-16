import { FileApp } from "./File";
import { Links } from "./Links";

export class Message {
  id: number;
  title: string;
  summary: string;
  sendDate: string;
  status: string;
  message: string;
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
  }
}

export function getMessageColuns() {
  return [
    { field: 'title', header: 'Titulo' },
    { field: 'sendDate', header: 'DataEnvio', isTag: true, isDate: true },
    { field: 'status', header: 'Status', isTag: true },
    { field: 'group', header: 'Curso/Grupo' },
    { field: 'views', header: 'Visualizações' },
  ]
}