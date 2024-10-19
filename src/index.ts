import "dotenv/config";
import http, { IncomingMessage } from "http";
import { userController } from "./controller/userController";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req: IncomingMessage, res) => {
  if (req.url?.startsWith("/users")) {
    userController(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(
      "404 - The requested resource does not exist. Please check the URL."
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
