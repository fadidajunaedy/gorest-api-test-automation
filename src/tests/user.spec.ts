import { Response } from "supertest";
import api, { commonHeaders } from "../configs/api.adapter";
import { User } from "../interfaces/user.interface";

import logger from "../utils/logger";
import generateUser from "../utils/user.generator";

describe("Feature: User Resource - CRUD Operations", () => {
  let userId: number;
  let userData: User;

  beforeAll(() => {
    userData = generateUser();
  });

  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== START: "${testName}" ===`);
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== END: "${testName}" ===`);
  });

  test("Should create a new user successfully with valid data (201 Created)", async () => {
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 201) {
      logger.error(`Create User fail. Expected 201 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    userId = response.body.id;
    logger.info(`Create User success with ID: ${userId}`);
  });

  test("Should retrieve user details successfully using valid ID (200 OK)", async () => {
    logger.debug(`ID Param: ${userId}`);
    const response: Response = await api
      .get(`/users/${userId}`)
      .set(commonHeaders);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 200) {
      logger.error(`Get User fail. Expected 200 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
  });

  test("Should update user status successfully (200 OK)", async () => {
    const newStatus: string =
      userData.status == "active" ? "inactive" : "active";
    logger.debug(`ID Params: ${userId}`);
    logger.debug(`Request Body: ${JSON.stringify({ status: newStatus })}`);
    const response: Response = await api
      .patch(`/users/${userId}`)
      .set(commonHeaders)
      .send({ status: newStatus });
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 200) {
      logger.error(`Update User fail. Expected 200 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.status).not.toBe(userData.status);
  });

  test("Should delete user successfully and verify non-existence (404 No Response Body)", async () => {
    logger.debug(`ID Params: ${userId}`);
    const response: Response = await api
      .delete(`/users/${userId}`)
      .set(commonHeaders);
    if (response.status !== 204) {
      logger.error(`Delete User fail. Expected 204 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(204);
    logger.info("Delete User success");
    logger.info(`Verify the deletion User with ID: ${userId}`);
    logger.debug(`ID Params: ${userId}`);
    const verifyResponse: Response = await api
      .get(`/users/${userId}`)
      .set(commonHeaders);
    if (verifyResponse.status !== 404) {
      logger.error(
        `Verify User deletion fail. Expected 404 but got ${verifyResponse.status}`
      );
      logger.error(`Response Body: ${JSON.stringify(verifyResponse.body)}`);
    }
    expect(verifyResponse.status).toBe(404);
  });
});

describe("Feature: User Resource - Validation", () => {
  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== START: "${testName}" ===`);
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== END: "${testName}" ===`);
  });

  test("Should return 422 when creating a user with a duplicated email", async () => {
    const userData: User = generateUser();
    logger.debug(`First Request Body: ${JSON.stringify(userData)}`);
    const firstResponse: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`First Response Status: ${firstResponse.status}`);
    logger.debug(`First Response Body: ${JSON.stringify(firstResponse.body)}`);
    if (firstResponse.status !== 201) {
      logger.error(
        `Create User fail. Expected 201 but got ${firstResponse.status}`
      );
      logger.error(`Response Body: ${JSON.stringify(firstResponse.body)}`);
    }
    expect(firstResponse.status).toBe(201);
    logger.debug(`Second Request Body: ${JSON.stringify(userData)}`);
    const secondResponse: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Second Response Status: ${secondResponse.status}`);
    logger.debug(
      `Second Response Body: ${JSON.stringify(secondResponse.body)}`
    );
    if (secondResponse.status !== 422) {
      logger.error(`Expected 422 but got ${secondResponse.status}`);
      logger.error(`Response Body: ${JSON.stringify(secondResponse.body)}`);
    }
    expect(secondResponse.status).toBe(422);
    expect(secondResponse.body[0].field).toBe("email");
    expect(secondResponse.body[0].message).toBe("has already been taken");
  });

  test("Should return 422 when 'gender' value is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      gender: "Lanang" as any,
    };
    logger.info("=== START: NEGATIVE - INVALID GENDER ===");
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(422);
    expect(response.body[0].field).toBe("gender");
    expect(response.body[0].message).toBe(
      "can't be blank, can be male of female"
    );
  });

  test("Should return 422 when 'status' value is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      status: "Sick" as any,
    };
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(422);
    expect(response.body[0].field).toBe("status");
    expect(response.body[0].message).toBe("can't be blank");
  });

  test("Should return 422 when mandatory fields are missing", async () => {
    const userData = {
      name: "Fadida Junaedy",
      email: "fadidajunaedy@mail.com",
    };
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(422);
    expect(response.body[0].field).toBe("gender");
    expect(response.body[0].message).toBe(
      "can't be blank, can be male of female"
    );
    expect(response.body[1].field).toBe("status");
    expect(response.body[1].message).toBe("can't be blank");
  });

  test("Should return 422 when 'email' format is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      email: "fadidajunaedy.com",
    };
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(422);
    expect(response.body[0].field).toBe("email");
    expect(response.body[0].message).toBe("is invalid");
  });
});

describe("Feature: User Resource - Security & Authentication", () => {
  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== START: "${testName}" ===`);
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== END: "${testName}" ===`);
  });

  test("Should return 401 when Authorization header is missing", async () => {
    const userData: User = generateUser();
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api.post("/users").send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 401) {
      logger.error(`Expected 401 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication failed");
  });

  test("Should return 401 when Authorization token is invalid", async () => {
    const userData: User = generateUser();
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);
    const response: Response = await api
      .post("/users")
      .set({
        Authorization: `Bearer 123456`,
        "Content-Type": "application/json",
        Accept: "application/json",
      })
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 401) {
      logger.error(`Expected 401 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});
