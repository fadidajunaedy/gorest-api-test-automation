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

  test("Should create a new user successfully with valid data (201 Created)", async () => {
    logger.info("== STARTING CASE: CREATE USER ==");
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);

    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);

    if (response.status !== 201) {
      logger.error(
        `Create User failed. Expected 201 but got ${response.status}`
      );
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);

    userId = response.body.id;
    logger.info(`Create User success with ID: ${userId}`);
    logger.info("== END CASE: CREATE USER ==");
  });

  test("Should retrieve user details successfully using valid ID (200 OK)", async () => {
    logger.info("== STARTING CASE: GET USER DETAIL ==");
    logger.debug(`ID Param: ${userId}`);

    const response: Response = await api
      .get(`/users/${userId}`)
      .set(commonHeaders);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);

    if (response.status !== 200) {
      logger.error(`Get User failed. Expected 200 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);

    logger.info("Get Detail User success");
    logger.info("== END CASE: GET USER DETAIL ==");
  });

  test("Should update user status successfully (200 OK)", async () => {
    const newStatus: string =
      userData.status == "active" ? "inactive" : "active";
    logger.info("== STARTING CASE: UPDATE USER ==");
    logger.debug(`ID Params: ${userId}`);
    logger.debug(`Request Body: ${JSON.stringify({ status: newStatus })}`);

    const response: Response = await api
      .patch(`/users/${userId}`)
      .set(commonHeaders)
      .send({ status: newStatus });
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);

    if (response.status !== 200) {
      logger.error(
        `Update User failed. Expected 200 but got ${response.status}`
      );
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.status).not.toBe(userData.status);

    logger.info("Update User success");
    logger.info("== END CASE: UPDATE USER ==");
  });

  test("Should delete user successfully and verify non-existence (204 No Response Body)", async () => {
    logger.info("== STARTING CASE: DELETE USER ==");
    logger.debug(`ID Params: ${userId}`);

    const response: Response = await api
      .delete(`/users/${userId}`)
      .set(commonHeaders);
    if (response.status !== 204) {
      logger.error(
        `Delete User failed. Expected 204 but got ${response.status}`
      );
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
        `Verify User deletion failed. Expected 404 but got ${verifyResponse.status}`
      );
      logger.error(`Response Body: ${JSON.stringify(verifyResponse.body)}`);
    }

    expect(verifyResponse.status).toBe(404);

    logger.info("Verify User deletion success");
    logger.info("== END CASE: DELETE USER ==");
  });
});

describe("Feature: User Resource - Validation", () => {
  test("Should return 422 when creating a user with a duplicated email", async () => {
    const userData: User = generateUser();
    logger.info("== STARTING CASE: CREATE USER WITH DUPLICATED EMAIL ==");
    logger.debug(`First Request Body: ${JSON.stringify(userData)}`);

    const firstResponse: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    logger.debug(`First Response Status: ${firstResponse.status}`);
    logger.debug(`First Response Body: ${JSON.stringify(firstResponse.body)}`);

    if (firstResponse.status !== 201) {
      logger.error(
        `Create User failed. Expected 201 but got ${firstResponse.status}`
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

    logger.info("Create User successfully failed because email is duplicated");
    logger.info("== END CASE: CREATE USER WITH DUPLICATED EMAIL ==");
  });

  test("Should return 422 when 'gender' value is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      gender: "Lanang" as any,
    };
    logger.info("== STARTING CASE: CREATE USER WITH INVALID GENDER ==");
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

    logger.info("Create User successfully failed because gender is invalid");
    logger.info("== END CASE: CREATE USER WITH INVALID EMAIL ==");
  });

  test("Should return 422 when 'status' value is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      status: "Sick" as any,
    };
    logger.info("== STARTING CASE: CREATE USER WITH INVALID STATUS ==");
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

    logger.info("Create User successfully failed because status is invalid");
    logger.info("== END CASE: CREATE USER WITH INVALID STATUS ==");
  });

  test("Should return 422 when mandatory fields are missing", async () => {
    const userData = {
      name: "Fadida Junaedy",
      email: "fadidajunaedy@mail.com",
    };

    logger.info(
      "== STARTING CASE: CREATE USER WITH MISSING MANDATORY FIELDS =="
    );
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

    logger.info("Create User successfully failed because status is invalid");
    logger.info("== END CASE: CREATE USER WITH MISSING MANDATORY FIELDS ==");
  });

  test("Should return 422 when 'email' format is invalid", async () => {
    const userData: User = {
      ...generateUser(),
      email: "fadidajunaedy.com",
    };
    logger.info("== STARTING CASE: CREATE USER WITH INVALID EMAIL ==");
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

    logger.info("Create User successfully failed because email is invalid");
    logger.info("== END CASE: CREATE USER WITH INVALID EMAIL ==");
  });
});

describe("Feature: User Resource - Security & Authentication", () => {
  test("Should return 401 when Authorization header is missing", async () => {
    const userData: User = generateUser();
    logger.info(
      "== STARTING CASE: CREATE USER WITHOUT HEADER AUTHORIZATION =="
    );
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

    logger.info(
      "Create User successfully failed because there is no header Authorization"
    );
    logger.info("== END CASE: CREATE USER WITHOUT HEADER AUTHORIZATION ==");
  });

  test("Should return 401 when Authorization token is invalid", async () => {
    const userData: User = generateUser();
    logger.info(
      "== STARTING CASE: CREATE USER WITH INVALID TOKEN AUTHORIZATION =="
    );
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

    logger.info(
      "Create User successfully failed because token Authorization is invalid"
    );
    logger.info("== END CASE: CREATE USER WITH INVALID TOKEN AUTHORIZATION ==");
  });
});
