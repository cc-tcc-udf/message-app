export class GenericResponse {
  success: boolean;
  message: String;
  data?: any;

  constructor(obj: GenericResponse) {
    this.success = obj.success;
    this.message = obj.message;
    this.data = obj.data;
  }
}