export class RefreshToken {
  email: string;
  refreshToken: string

  constructor(obj: RefreshToken) {
    this.email = obj.email
    this.refreshToken = obj.refreshToken
  }
}