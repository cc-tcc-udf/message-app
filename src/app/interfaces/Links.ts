export class Links {
  id!: number;
  title!: string;
  link!: string;
  id_msg?: number;


  constructor(link: Links) {
    this.id = link.id;
    this.title = link.title;
    this.link = link.link;
    this.id_msg = link.id_msg;
  }
}
