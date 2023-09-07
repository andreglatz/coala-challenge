type UserConstructor = {
  id?: string;
  name: string;
  username: string;
  password: string;
};

export class User {
  id: string;
  name: string;
  username: string;
  password: string;

  constructor(params: UserConstructor) {
    this.id = params.id;
    this.name = params.name;
    this.username = params.username;
    this.password = params.password;
  }
}