import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/env";
import { FileApp } from "@models/File";

@Injectable()
export class FileService {
  constructor(private _http: HttpClient) { }

  private api = `${environment.API_URL}/public/file`

  createFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<FileApp>(`${this.api}/create`, formData);
  }

  updateFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<FileApp>(`${this.api}/${id}/update`, formData);
  }
}