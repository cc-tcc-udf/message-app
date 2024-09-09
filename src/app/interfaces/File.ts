export class File {
  id!: number;
  name!: string;
  type!: string;
  url!: string;
  size!: number;
  key!: string;
  uid!: string;
  id_ext!: number;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.type = file.type;
    this.url = file.url;
    this.size = file.size;
    this.key = file.key;
    this.uid = file.uid;
    this.id_ext = file.id_ext;
  }
}
