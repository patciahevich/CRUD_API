import { IncomingMessage, ServerResponse } from "http";
import { User, UserManager } from "../model/users";
import { getUserData } from "../utils/utils";
import { validate } from "uuid";
import { successResponse, errorResponse } from "../response/response";

const userManager = new UserManager();

export async function userController(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const userId = req.url?.split("/")[2];

  switch (req.method) {
    case "GET":
      if (userId) {
        if (!validate(userId)) {
          errorResponse(
            res,
            400,
            "Invalid userId. The userId must be a valid UUID."
          );
        }

        const userToGet = userManager.getUserById(userId);

        if (!userToGet) {
          errorResponse(res, 404, `User with ID ${userId} not found`);
        } else {
          successResponse(res, userToGet, 200);
        }
      } else {
        const payload = userManager.getUsers();
        successResponse(res, payload, 200);
      }
      break;

    case "POST":
      if (userId) {
        errorResponse(res, 400, "Invalid url");
      } else {
        try {
          const newUser: User = await getUserData(req);
          const { name, age, hobbies } = newUser;

          if (!name || !age || !hobbies) {
            errorResponse(
              res,
              400,
              "Missing one or more required fields: name, age, hobbies"
            );
          }

          const payload = userManager.createUser(name, age, hobbies);
          successResponse(res, payload, 201);
        } catch (err) {
          errorResponse(res, 400, "Invalid type of data");
        }
      }
      break;

    case "PUT":
      if (userId) {
        if (!validate(userId)) {
          errorResponse(
            res,
            400,
            "Invalid userId. The userId must be a valid UUID."
          );
        }

        try {
          const newUserData: User = await getUserData(req);
          const { name, age, hobbies } = newUserData;

          if (!name || !age || !hobbies) {
            errorResponse(
              res,
              400,
              "Missing one or more required fields: name, age, hobbies"
            );
          }

          const payload = userManager.updateUser(userId, name, age, hobbies);

          if (payload) {
            successResponse(res, payload, 200);
          } else {
            errorResponse(res, 404, `404 - User with ID ${userId} not found`);
          }
        } catch (err) {
          errorResponse(res, 400, "Invalid type of data");
        }
      } else {
        errorResponse(
          res,
          400,
          "Missing userId. A valid userId is required to update a user."
        );
      }
      break;

    case "DELETE":
      if (userId) {
        if (!validate(userId)) {
          errorResponse(
            res,
            400,
            "Invalid userId. The userId must be a valid UUID."
          );
        }

        const payload = userManager.deleteUser(userId);
        if (payload) {
          res.writeHead(204, { "Content-Type": "text/plain" });
          res.end();
          return;
        } else {
          errorResponse(res, 404, `The user with id ${userId} not found`);
        }
      } else {
        errorResponse(
          res,
          400,
          "Missing userId. A valid userId is required to delete a user."
        );
      }
      break;
    default:
      errorResponse(res, 400, "Invalid method.");
  }
}
