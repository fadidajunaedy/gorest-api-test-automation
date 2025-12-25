import api, { commonHeaders } from "../configs/api.adapter";
import generateUser from "../utils/user.generator";
import { User } from "../interfaces/user.interface";

describe("E2E: User Lifecycle Flow", () => {
  let userId: number;
  let userData: User;

  beforeAll(() => {
    userData = generateUser();
  });

  test("POST User should be success with valid data", async () => {
    const response = await api.post("/users").set(commonHeaders).send(userData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);

    userId = response.body.id;
    console.log(`Created User ID: ${userId}`);
  });

  test("GET User detail should be success with valid id", async () => {
    const response = await api.get(`/users/${userId}`).set(commonHeaders);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
  });

  test("PATCH User data update should be success", async () => {
    const newStatus = userData.status == "active" ? "inactive" : "active";
    const response = await api
      .patch(`/users/${userId}`)
      .set(commonHeaders)
      .send({ status: newStatus });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.status).not.toBe(userData.status);
  });

  test("DELETE User data should be success", async () => {
    const response = await api.delete(`/users/${userId}`).set(commonHeaders);
    expect(response.status).toBe(204);

    const verifyResponse = await api.get(`/users/${userId}`).set(commonHeaders);
    expect(verifyResponse.status).toBe(404);
  });
});
