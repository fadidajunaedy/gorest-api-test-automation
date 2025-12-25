import supertest from "supertest";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.BASE_URL || !process.env.GOREST_ACCESS_TOKEN) {
  throw new Error("Error: BASE_URL or GOREST_ACCESS_TOKEN is not found");
}

const baseUrl = process.env.BASE_URL;
const api = supertest(baseUrl);

export const commonHeaders = {
  Authorization: `Bearer ${process.env.GOREST_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};
