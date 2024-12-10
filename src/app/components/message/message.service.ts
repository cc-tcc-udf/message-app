import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/env";
import { GenericResponse } from "@models/GenericResponse";
import { Message } from "@models/Message";
import { PageableDTO } from "@models/pageable";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private api = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllByResp(id: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/listByResp/${id}`);
  }

  remove(id: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/remove/${id}`);
  }

  getAllMessages() {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/listAll`);
  }

  getPageable(page: PageableDTO) {
    return this.http.post<GenericResponse>(`${this.api}/private/msg/list/pageable`, page);
  }

  getMsg(id: number | string) {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/${id}`);
  }

  getListById(id: number | string, end: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/list/${end}/${id}`);
  }

  getViews(id: number | string) {
    return this.http.get<GenericResponse>(`${this.api}/private/view/list/${id}`);
  }

  create(obj: Message) {
    return this.http.post<GenericResponse>(`${this.api}/private/msg/create`, obj);
  }

  send(obj: Message) {
    return this.http.post<GenericResponse>(`${this.api}/private/msg/send`, obj);
  }

  sendById(id: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/msg/send/${id}`);
  }

  getMessages(page: number, size: number, isAdmin: boolean, id?: string) {
    const url = isAdmin
      ? `${this.api}/private/msg/listAll?page=${page}&size=${size}`
      : `${this.api}/private/msg/listByResp/${id}?page=${page}&size=${size}`;
    return this.http.get<GenericResponse>(url);
  }

}
