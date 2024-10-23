import { IncomingMessage } from "http";
import { User } from "../model/users";

export async function getUserData(req: IncomingMessage): Promise<User> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("error", (error) => {
      reject(error);
    });

    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  });
}
