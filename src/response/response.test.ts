import { IncomingMessage, ServerResponse } from "http";
import { successResponse, errorResponse } from "./response";
import { User } from "../model/users";

describe("Response Handlers", () => {
  let res: ServerResponse<IncomingMessage>;

  beforeEach(() => {
    res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as ServerResponse<IncomingMessage>; // Mocking ServerResponse
  });

  describe("successResponse", () => {
    it("should respond with status 200 and a user object", () => {
      const user: User = {
        id: "1",
        name: "John Doe",
        age: 19,
        hobbies: ["painting"],
      };
      const statusCode = 200;

      successResponse(res, user, statusCode);

      expect(res.writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "application/json",
      });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(user));
    });

    it("should respond with status 200 and an array of users", () => {
      const users: User[] = [
        { id: "1", name: "John Doe", age: 56, hobbies: ["reading"] },
        { id: "2", name: "Jane Doe", age: 18, hobbies: ["cars"] },
      ];
      const statusCode = 200;

      successResponse(res, users, statusCode);

      expect(res.writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "application/json",
      });
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(users));
    });
  });

  describe("errorResponse", () => {
    it("should respond with status 400 and error message", () => {
      const statusCode = 400;
      const message = "Bad Request";

      errorResponse(res, statusCode, message);

      expect(res.writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalledWith(message);
    });

    it("should respond with status 500 and error message", () => {
      const statusCode = 500;
      const message = "Internal Server Error";

      errorResponse(res, statusCode, message);

      expect(res.writeHead).toHaveBeenCalledWith(statusCode, {
        "Content-Type": "text/plain",
      });
      expect(res.end).toHaveBeenCalledWith(message);
    });
  });
});
