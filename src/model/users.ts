// userManager.ts
import { v4 as uuidv4 } from "uuid";

export type NewUser = {
  name: string;
  age: number;
  hobbies: string[];
};

export type User = NewUser & {
  id: string;
};

export class UserManager {
  private users: User[] = [];

  constructor(initialUsers?: User[]) {
    if (initialUsers) {
      this.users = initialUsers;
    } else {
      this.users = [];
    }
  }
  createUser(name: string, age: number, hobbies: string[]): User {
    const newUser: User = {
      id: uuidv4(),
      name,
      age,
      hobbies,
    };
    this.users.push(newUser);
    return newUser;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  updateUser(
    id: string,
    name: string,
    age: number,
    hobbies: string[]
  ): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser: User = {
      id,
      name,
      age,
      hobbies,
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
