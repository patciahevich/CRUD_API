import "dotenv/config";
import http, { IncomingMessage } from "http";
import { createUser, getUsers, User } from "./model/users";
import { getUserData } from "./utils/utils";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req: IncomingMessage, res) => {
  if (req.url === "/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getUsers()));
  } else if (req.url === "/users" && req.method === "POST") {
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
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
