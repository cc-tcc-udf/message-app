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
  phone!: string;
  id_curso: number;

  constructor(usr: Usuario) {
    this.id = usr.id;
    this.uid = usr.uid;
    this.name = usr.name;
    this.email = usr.email;
    this.password = usr.password;
    this.profilePhoto = usr.profilePhoto;
    this.coverPhoto = usr.coverPhoto;
    this.phone = usr.phone;
    this.roles = usr.roles;
    this.id_curso = usr.id_curso;
  }
}

export class CustomUsuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  profilePhoto!: string;
  phone!: string;
  coverPhoto!: string;
  roles!: Roles_user[];
  id_curso: number;

  constructor(user: Usuario) {
    this.id = user.id;
    this.uid = user.uid;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.profilePhoto = getLink(user?.profilePhoto);
    this.roles = user.roles;
    this.id_curso = user.id_curso;
  }
}

function getLink(file: FileApp): string {
  return file?.url;
}
