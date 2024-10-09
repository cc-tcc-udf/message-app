import { FileApp } from "./File";
import { Links } from "./Links";

export class Message {
  id: number;
  title: string;
  summary: string;
  sendDate: Date;
  status: string;
  message: string;
  response: string;
  attachments: FileApp[];
  links: Links[];

  constructor(msg: Message) {
    this.id = msg.id;
    this.title = msg.title;
    this.summary = msg.summary;
    this.sendDate = new Date(msg.sendDate);
    this.status = msg.status;
    this.message = msg.message;
    this.response = msg.response;
    this.attachments = msg.attachments;
    this.links = msg.links;
  }
}
