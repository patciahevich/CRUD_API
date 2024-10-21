import request from "supertest";
import { server } from "../src";
import { userController } from "./controller/userController";

jest.mock("./controller/userController");

describe("HTTP Server Tests", () => {
  afterAll((done) => done());
  it("should return status 200", async () => {
    (userController as jest.Mock).mockImplementation(async (_, res) => {
      res.status = 200;
      res.end(JSON.stringify({ data: "Some data" }));
    });

    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
  });

  it("should return status 404 if the URL is invalid", async () => {
    (userController as jest.Mock).mockImplementation((_, res) => {
      res.status = 404;
      res.end(
        "404 - The requested resource does not exist. Please check the URL."
      );
    });

    const response = await request(server).get("/invalid/url/to/test");
    expect(response.status).toBe(404);
    expect(response.text).toBe(
      "404 - The requested resource does not exist. Please check the URL."
    );
  });

  it("should return status 500 is some issues on the server side", async () => {
    (userController as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const response = await request(server).get("/api/users");

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      "Internal Server Error: Something went wrong. Please try again later."
    );
  });
});
