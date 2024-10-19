import { uuid } from 'uuidv4';

export type NewUser = {
  name: string;
  age: number;
  hobbies: string[] | [];
};

export type User = NewUser & {
  id: string;
};

const users: User[] = [
  {
    id: "111",
    name: "Ivan",
    age: 18,
    hobbies: ["swimming"],
  },
];

export const createUser = (newUser: NewUser): User => {
  const user: User = {
    id: uuid(),
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

export const updateUser = (userToUpdate: User): User | null => {
  const userIndex = users.findIndex((user) => user.id === userToUpdate.id);
  if (userIndex === -1) return null;

  const updatedUser = {
    id: userToUpdate.id,
    name: userToUpdate.name,
    age: userToUpdate.age,
    hobbies: userToUpdate.hobbies,
  };
  users[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  users.splice(userIndex, 1);
  return true;
};
