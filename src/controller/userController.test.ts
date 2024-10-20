import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";
import { userController } from "./userController";
import { successResponse, errorResponse } from "../response/response";
import { UserManager } from "../model/users";
import { getUserData } from "../utils/utils";

jest.mock("uuid", () => ({
  validate: jest.fn(),
}));

jest.mock("../response/response");
jest.mock("../model/users");
jest.mock("../utils/utils");

const baseLink = "/users";

describe("myModule tests", () => {
  let req: IncomingMessage;
  let res: ServerResponse<IncomingMessage>;

  beforeEach(() => {
    res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse<IncomingMessage>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET method", () => {
    it("should return user data when a valid userId is provided", async () => {
      const userId = "valid-uuid";
      req = { method: "GET", url: `${baseLink}/${userId}` } as IncomingMessage;
      (validate as jest.Mock).mockReturnValueOnce(true);
      const mockUser = {
        id: userId,
        name: "John Doe",
        age: 30,
        hobbies: ["Reading"],
      };
      jest
        .spyOn(UserManager.prototype, "getUserById")
        .mockReturnValue(mockUser);

      await userController(req, res);

      expect(successResponse).toHaveBeenCalledWith(res, mockUser, 200);
    });

    it("should return 400 error for invalid userId", async () => {
      req = {
        method: "GET",
        url: `${baseLink}/invalid-uuid`,
      } as IncomingMessage;
      await userController(req, res);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Invalid userId. The userId must be a valid UUID."
      );
    });

    it("should return 404 error if user not found", async () => {
      const userId = "valid-uuid";
      (validate as jest.Mock).mockReturnValueOnce(true);
      req = { method: "GET", url: `${baseLink}/${userId}` } as IncomingMessage;
      jest
        .spyOn(UserManager.prototype, "getUserById")
        .mockReturnValue(undefined);

      await userController(req, res);
      expect(errorResponse).toHaveBeenCalledWith(
        res,
        404,
        `User with ID ${userId} not found`
      );
    });

    it("should return all users when", async () => {
      req = { method: "GET", url: "baseLink" } as IncomingMessage;
      const usersList = [
        { id: "1", name: "John Doe", age: 30, hobbies: ["reading"] },
      ];
      jest.spyOn(UserManager.prototype, "getUsers").mockReturnValue(usersList);

      await userController(req, res);

      expect(successResponse).toHaveBeenCalledWith(res, usersList, 200);
    });
  });

  describe("POST method", () => {
    it("should create a new user", async () => {
      req = { method: "POST", url: baseLink } as IncomingMessage;
      const newUser = { name: "John Doe", age: 30, hobbies: ["Reading"] };
      (getUserData as jest.Mock).mockImplementation(() => newUser);
      const createdUser = { id: "2", ...newUser };
      jest
        .spyOn(UserManager.prototype, "createUser")
        .mockReturnValue(createdUser);

      await userController(req, res);

      expect(successResponse).toHaveBeenCalledWith(res, createdUser, 201);
    });

    it("should return 400 error for missing fields", async () => {
      req = { method: "POST", url: baseLink } as IncomingMessage;
      (getUserData as jest.Mock).mockImplementation(() => {
        return { name: "John Doe", age: null, hobbies: ["Reading"] };
      });

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Missing one or more required fields: name, age, hobbies"
      );
    });

    it("should return 400 error for invalid data", async () => {
      req = { method: "POST", url: baseLink } as IncomingMessage;
      (getUserData as jest.Mock).mockRejectedValue(new Error("Invalid data"));

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Invalid type of data"
      );
    });
  });

  describe("PUT method", () => {
    it("should update an existing user", async () => {
      const userId = "valid-uuid";
      (validate as jest.Mock).mockReturnValueOnce(true);
      req = { method: "PUT", url: `${baseLink}/${userId}` } as IncomingMessage;
      const updatedUserData = {
        name: "Jane Doe",
        age: 25,
        hobbies: ["Traveling"],
      };
      (getUserData as jest.Mock).mockResolvedValue(updatedUserData);
      const updatedUser = { id: userId, ...updatedUserData };
      jest
        .spyOn(UserManager.prototype, "updateUser")
        .mockReturnValue(updatedUser);

      await userController(req, res);

      expect(successResponse).toHaveBeenCalledWith(res, updatedUser, 200);
    });

    it("should return 400 error for invalid userId", async () => {
      req = {
        method: "PUT",
        url: `${baseLink}/invalid-uuid`,
      } as IncomingMessage;

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Invalid userId. The userId must be a valid UUID."
      );
    });

    it("should return 404 error if user not found during update", async () => {
      const userId = "valid-uuid";
      (validate as jest.Mock).mockReturnValueOnce(true);
      req = { method: "PUT", url: `${baseLink}/${userId}` } as IncomingMessage;
      const updatedUserData = {
        name: "Jane Doe",
        age: 25,
        hobbies: ["Traveling"],
      };
      (getUserData as jest.Mock).mockResolvedValue(updatedUserData);
      jest.spyOn(UserManager.prototype, "updateUser").mockReturnValue(null);

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        404,
        `404 - User with ID ${userId} not found`
      );
    });

    it("should return 400 error for missing userId", async () => {
      req = { method: "PUT", url: baseLink } as IncomingMessage;

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Missing userId. A valid userId is required to update a user."
      );
    });
  });

  describe("DELETE method", () => {
    it("should delete an existing user", async () => {
      const userId = "valid-uuid";
      (validate as jest.Mock).mockReturnValueOnce(true);
      req = {
        method: "DELETE",
        url: `${baseLink}/${userId}`,
      } as IncomingMessage;
      jest.spyOn(UserManager.prototype, "deleteUser").mockReturnValue(true);

      await userController(req, res);

      expect(res.writeHead).toHaveBeenCalledWith(204, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalled();
    });

    it("should return 400 error for invalid userId", async () => {
      req = {
        method: "DELETE",
        url: `${baseLink}/invalid-uui`,
      } as IncomingMessage;

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Invalid userId. The userId must be a valid UUID."
      );
    });

    it("should return 404 error if user not found during delete", async () => {
      const userId = "valid-uuid";
      (validate as jest.Mock).mockReturnValueOnce(true);
      req = {
        method: "DELETE",
        url: `${baseLink}/${userId}`,
      } as IncomingMessage;
      jest.spyOn(UserManager.prototype, "deleteUser").mockReturnValue(false);

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        404,
        `The user with id ${userId} not found`
      );
    });

    it("should return 400 error for missing userId", async () => {
      req = { method: "DELETE", url: baseLink } as IncomingMessage;

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(
        res,
        400,
        "Missing userId. A valid userId is required to delete a user."
      );
    });
  });

  describe("Invalid method", () => {
    it("should return 400 error for invalid method", async () => {
      req = { method: "PATCH", url: baseLink } as IncomingMessage;

      await userController(req, res);

      expect(errorResponse).toHaveBeenCalledWith(res, 400, "Invalid method.");
    });
  });
});
