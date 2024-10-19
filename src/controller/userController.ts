import { IncomingMessage, ServerResponse } from "http";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  User,
} from "../model/users";
import { getUserData } from "../utils/utils";
import { validate } from "uuid";

export async function userController(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  const userId = req.url?.split("/")[2];
  switch (req.method) {
    case "GET":
      if (userId) {
        if (!validate(userId)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(`400 - Invalid userId. The userId must be a valid UUID.`);
          return;
        }

        const userToGet = getUserById(userId);

        if (!userToGet) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`404 - User with ID ${userId} not found`);
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(userToGet));
        return;
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getUsers()));
        return;
      }
    case "POST":
      try {
        const newUser: User = await getUserData(req);
        const { name, age, hobbies } = newUser;

        if (!name || !age || !hobbies) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing one or more required fields: name, age, hobbies");
          return;
        }

        const response = createUser(name, age, hobbies);
        res.writeHead(201, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(response));
        return;
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid type of data");
        return;
      }
    case "PUT":
      if (userId) {
        if (!validate(userId)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(`400 - Invalid userId. The userId must be a valid UUID.`);
          return;
        }

        try {
          const newUserData: User = await getUserData(req);
          const { name, age, hobbies } = newUserData;

          if (!name || !age || !hobbies) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Missing one or more required fields: name, age, hobbies");
            return;
          }

          const response = updateUser(userId, name, age, hobbies);

          if (response) {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify(response));
            return;
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end(`404 - User with ID ${userId} not found`);
            return;
          }
        } catch (err) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Invalid type of data");
          return;
        }
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing userId. A valid userId is required to update a user.");
      }
    case "DELETE":
      if (userId) {
        if (!validate(userId)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(`400 - Invalid userId. The userId must be a valid UUID.`);
          return;
        }

        const response = deleteUser(userId);
        console.log(response);
        if (response) {
          res.writeHead(204, { "Content-Type": "text/plain" });
          res.end(`The user with id ${userId} has been deleted`);
          return;
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`The user with id ${userId} not found`);
          return;
        }
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Missing userId. A valid userId is required to delete a user.");
      }
  }
}
