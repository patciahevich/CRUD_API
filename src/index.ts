import "dotenv/config";
import http, { IncomingMessage } from "http";
import { userController } from "./controller/userController";

const PORT = process.env.PORT || 3000;

export const server = http.createServer(async (req: IncomingMessage, res) => {
  try {
    if (req.url?.startsWith("/api/users") && req.url?.split("/").length <= 4) {
      await userController(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(
        "404 - The requested resource does not exist. Please check the URL.",
      );
    }
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(
      "Internal Server Error: Something went wrong. Please try again later.",
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
