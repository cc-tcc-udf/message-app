import { File } from "./File";
import { Roles_user } from "./Roles";

export class Usuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  password!: string;
  foto_perfil!: File;
  foto_capa!: File;
  roles!: Roles_user[];
}