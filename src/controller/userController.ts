import { IncomingMessage, ServerResponse } from "http";
import { isUuid as isUuidV4 } from "uuidv4";
import { createUser, getUserById, getUsers, User } from "../model/users";
import { getUserData } from "../utils/utils";

export async function userController(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage }
) {
  const userId = req.url?.split("/")[2];
  switch (req.method) {
    case "GET":
      if (userId) {
        if (!isUuidV4(userId)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(`400 - Invalid userId. The userId must be a valid UUID.`);
        }

        const userToGet = getUserById(userId);

        if (!userToGet) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`404 - User with ID ${userId} not found`);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(userToGet));
        }
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getUsers()));
      }
      break;
    case "POST":
      try {
        const newUser: User = await getUserData(req);
        const response = createUser(newUser);
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(response));
      } catch (err) {
        res.end({ message: err });
      }
      break;
  }
}
