import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/env';
import { GenericResponse } from '@models/GenericResponse';
import { Usuario } from '@models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private api = `${environment.API_URL}/private/auth`
  constructor(
    private _http: HttpClient
  ) { }

  getUsers() {
    return this._http.get<GenericResponse>(`${this.api}/adm/list`);
  }

  createAdm(form: Usuario) {
    return this._http.post<Usuario>(`${this.api}/create`, form);
  }
}
