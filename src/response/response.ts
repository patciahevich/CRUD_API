import { IncomingMessage, ServerResponse } from "http";
import { User } from "../model/users";

export function successResponse(
  res: ServerResponse<IncomingMessage>,
  payload: User | User[],
  statusCode: number,
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

export function errorResponse(
  res: ServerResponse<IncomingMessage>,
  statusCode: number,
  message: string,
) {
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.end(message);
}
