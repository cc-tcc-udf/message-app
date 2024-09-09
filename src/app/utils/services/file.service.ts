import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/env";

@Injectable()
export class FileService {
  constructor(private _http: HttpClient) { }

  private api = `${environment.API_URL}/private/file`

  createFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post(`${this.api}/create/${id}`, formData);
  }

  updateFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post(`${this.api}/${id}/update`, formData);
  }
}