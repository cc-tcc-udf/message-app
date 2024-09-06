export class GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;

  constructor(obj: GenericResponse<T>) {
    this.success = obj.success;
    this.message = obj.message;
    this.data = obj.data;
  }
}
