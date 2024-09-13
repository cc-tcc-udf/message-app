import { File } from "./File";
import { Roles_user } from "./Roles";

export class Usuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  password!: string;
  profilePhoto!: File;
  coverPhoto!: File;
  roles!: Roles_user[];
}

export class CustomUsuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  profilePhoto!: string;
  coverPhoto!: string;
  roles!: Roles_user[];

  constructor(user: Usuario) {
    this.id = user.id;
    this.uid = user.uid;
    this.name = user.name;
    this.email = user.email;
    this.profilePhoto = getLink(user?.profilePhoto);
  }
}

function getLink(file: File): string {
  return file?.url;
}
