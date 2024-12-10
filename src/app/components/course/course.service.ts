import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/env';
import { Course } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private api = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllCourses(isGroup: boolean) {
    return this.http.get<GenericResponse>(`${this.api}/private/course/list?isGroup=${encodeURIComponent(isGroup)}`);
  }

  getGroups() {
    return this.http.get<GenericResponse>(`${this.api}/private/course/groups`);
  }

  create(obj: Course) {
    return this.http.post<GenericResponse>(`${this.api}/private/course/create`, obj);
  }

  getByResp(id: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/course/listByResp/${id}`);
  }

  getById(id: string) {
    return this.http.get<GenericResponse>(`${this.api}/private/course/${id}`);
  }
}
