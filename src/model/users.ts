import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  age: number;
  hobbies: string[] | [];
}

const users: User[] = [
  {
    id: "111",
    name: "Ivan",
    age: 18,
    hobbies: ["swimming"],
  },
];

export const createUser = (newUser: User): User => {
  const user: User = {
    id: uuidv4(),
    name: newUser.name,
    age: newUser.age,
    hobbies: newUser.hobbies,
  };
  users.push(user);
  return user;
};

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const updateUser = (
  id: string,
  name: string,
  age: number,
  hobbies: string[]
): User | null => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  const updatedUser = { id, name, age, hobbies };
  users[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  users.splice(userIndex, 1);
  return true;
};
