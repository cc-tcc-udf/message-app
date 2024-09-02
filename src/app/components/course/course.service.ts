import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/env';
import { GenericResponse } from '@models/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private api = `${environment.API_URL}`;

  constructor(private http: HttpClient) { }

  getAllCourses(isGroup: boolean) {
    return this.http.get<GenericResponse>(`${this.api}/public/course/list?isGroup=${encodeURIComponent(isGroup)}`)
  }
}
