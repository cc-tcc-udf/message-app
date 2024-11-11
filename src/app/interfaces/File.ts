export class FileApp {
  id!: string;
  name!: string;
  type!: string;
  url!: string;
  size!: number;
  key!: string;
  id_ext!: string;

  constructor(file: FileApp) {
    this.id = file.id;
    this.name = file.name;
    this.type = file.type;
    this.url = file.url;
    this.size = file.size;
    this.key = file.key;
    this.id_ext = file.id_ext;
  }
}
