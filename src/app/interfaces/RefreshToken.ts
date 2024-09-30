export class RefreshToken {
  email: string;
  token: string

  constructor(obj: RefreshToken) {
    this.email = obj.email
    this.token = obj.token
  }
}