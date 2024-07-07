import { Roles_user } from "./Roles";

export class Usuario {
  id!: number;
  uid!: string;
  name!: string;
  email!: string;
  password!: string;
  // foto_perfil!: Arquivo;
  // foto_capa!: Arquivo;
  roles!: Roles_user[];
}