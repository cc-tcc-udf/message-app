import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/env";
import { GenericResponse } from "@models/GenericResponse";
import { Message } from "@models/Message";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private api = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllMessages() {
    return this.http.get<GenericResponse>(`${this.api}/public/msg/list`);
  }

  getMsg(id: number | string) {
    return this.http.get<GenericResponse>(`${this.api}/public/msg/${id}`);
  }

  create(obj: Message) {
    return this.http.post<GenericResponse>(`${this.api}/public/msg/create`, obj);
  }
  
  send(obj: Message) {
    return this.http.post<GenericResponse>(`${this.api}/public/msg/send`, obj);
  }
}
