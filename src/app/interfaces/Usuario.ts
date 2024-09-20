import { FileApp } from "./File";
import { Roles_user } from "./Roles";

export class Usuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  password!: string;
  profilePhoto!: FileApp;
  coverPhoto!: FileApp;
  roles!: Roles_user[];

  constructor(usr: Usuario) {
    this.id = usr.id;
    this.uid = usr.uid;
    this.name = usr.name;
    this.email = usr.email;
    this.password = usr.password;
    this.profilePhoto = usr.profilePhoto;
    this.coverPhoto = usr.coverPhoto;
    this.roles = usr.roles;
  }
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

function getLink(file: FileApp): string {
  return file?.url;
}
