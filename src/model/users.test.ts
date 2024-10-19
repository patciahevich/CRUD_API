// userManager.test.ts
import { v4 as uuidv4 } from "uuid";
import { UserManager, User } from "../model/users";

jest.mock("uuid");

describe("UserManager", () => {
  let userManager: UserManager;

  beforeEach(() => {
    userManager = new UserManager([
      {
        id: "qwerty",
        name: "John",
        age: 18,
        hobbies: ["reading"],
      },
    ]);

    (uuidv4 as jest.Mock).mockReturnValue("mocked-uuid");
  });

  describe("createUser", () => {
    it("should create a new user and add it to the users array", () => {
      const newUser = userManager.createUser("John Doe", 25, [
        "reading",
        "gaming",
      ]);
      expect(newUser).toEqual({
        id: "mocked-uuid",
        name: "John Doe",
        age: 25,
        hobbies: ["reading", "gaming"],
      });
      expect(userManager.getUsers()).toContainEqual(newUser);
    });
  });

  describe("getUsers", () => {
    it("should return all users", () => {
      const users = userManager.getUsers();
      expect(users.length).toBe(1);
    });
  });

  describe("getUserById", () => {
    it("should return the correct user when given a valid ID", () => {
      const users = userManager.getUsers();
      const user = userManager.getUserById(users[0].id);
      expect(user).toEqual(users[0]);
    });

    it("should return undefined when given an invalid ID", () => {
      const user = userManager.getUserById("invalid-id");
      expect(user).toBeUndefined();
    });
  });

  describe("updateUser", () => {
    it("should update the user details", () => {
      const users = userManager.getUsers();
      const updatedUser = userManager.updateUser(users[0].id, "New Name", 30, [
        "new hobby",
      ]);
      expect(updatedUser).toEqual({
        id: users[0].id,
        name: "New Name",
        age: 30,
        hobbies: ["new hobby"],
      });
      expect(userManager.getUsers()[0]).toEqual(updatedUser);
    });

    it("should return null when trying to update a user with an invalid ID", () => {
      const result = userManager.updateUser("invalid-id", "John Doe", 25, [
        "reading",
      ]);
      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should delete the user from the array", () => {
      const users = userManager.getUsers();
      const success = userManager.deleteUser(users[0].id);
      expect(success).toBe(true);
      expect(userManager.getUsers()).toHaveLength(0); // Теперь пользователей нет
    });

    it("should return false when trying to delete a user with an invalid ID", () => {
      const success = userManager.deleteUser("invalid-id");
      expect(success).toBe(false);
    });
  });
});
