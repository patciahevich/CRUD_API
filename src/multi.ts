import cluster from "cluster";
import http, { IncomingMessage, ServerResponse } from "http";
import os from "os";
import "dotenv/config";

import { userController } from "./controller/userController";

const PORT = process.env.PORT || 3000;

async function serverWork(req: IncomingMessage, res: ServerResponse) {
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
}

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master process is running`);

  for (let i = 0; i < numCPUs; i++) {
    const port = +PORT + i;
    cluster.fork({ PORT: port });
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new one...`);

    if (cluster.workers) {
      const newPort = +PORT + Object.keys(cluster.workers).length;
      cluster.fork({ PORT: newPort });
    }
  });
} else {
  const port = process.env.PORT;
  http
    .createServer(async (req, res) => {
      await serverWork(req, res);
    })
    .listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
