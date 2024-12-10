import { FileApp } from "./File";
import { Roles_user } from "./Roles";

export class Login {
  email!: string;
  password!: string;
  isMobile: boolean = false;

  constructor(usr: Login) {
    this.email = usr.email;
    this.password = usr.password;
    this.isMobile = false;
  }
}
export class Usuario {
  id!: string;
  uid!: string;
  name!: string;
  email!: string;
  password!: string;
  profilePhoto!: FileApp;
  coverPhoto!: FileApp;
  roles!: Roles_user[];
  phone!: string;
  id_curso: string;
  active: boolean;

  constructor(usr: Usuario) {
    this.id = usr.id;
    this.uid = usr.uid;
    this.name = usr.name;
    this.email = usr.email;
    this.password = usr.password;
    const photo = usr.profilePhoto;
    if (photo) {
      photo.url = 'assets/img/svg/photo.svg';
    }
    this.profilePhoto = new FileApp(photo);
    this.coverPhoto = usr.coverPhoto;
    this.phone = usr.phone;
    this.roles = usr.roles;
    this.active = usr.active;
    this.id_curso = usr.id_curso;
  }
}

export class CustomUsuario {
  id!: string;
  uid!: string;
  name!: string;
  email!: string;
  profilePhoto!: string;
  phone!: string;
  active: boolean;
  ativo: string;
  coverPhoto!: string;
  roles!: Roles_user[];
  id_curso: string;
  color: string;

  constructor(user: Usuario) {
    this.id = user.id;
    this.uid = user.uid;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.profilePhoto = getLink(user?.profilePhoto);
    this.roles = user.roles;
    this.id_curso = user.id_curso;
    this.active = user.active;
    this.ativo = user.active ? 'Ativo' : 'Inativo';
    this.color = '#f5f9ff';
  }
}

function getLink(file: FileApp): string {
  return file?.url ?? 'assets/img/svg/photo.svg';
}


export function getColumnsUser() {
  return [
    { field: '', header: '', isUser: true },
    { field: 'name', header: 'Nome', isUser: false },
    { field: 'email', header: 'Email', isUser: false },
  ];
}