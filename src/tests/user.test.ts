import api, { commonHeaders } from "../configs/api.adapter";
import { User } from "../interfaces/user.interface";

import generateUser from "../utils/user.generator";
import logger from "../utils/logger";

describe("E2E: User Lifecycle Flow", () => {
  let userId: number;
  let userData: User;

  beforeAll(() => {
    userData = generateUser();
  });

  test("POST User should be success with valid data", async () => {
    logger.info("== STARTING CASE: CREATE USER ==");
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);

    const response = await api.post("/users").set(commonHeaders).send(userData);
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

  test("GET User detail should be success with valid id", async () => {
    logger.info("== STARTING CASE: GET USER DETAIL ==");
    logger.debug(`ID Param: ${userId}`);

    const response = await api.get(`/users/${userId}`).set(commonHeaders);
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

  test("PATCH User data update should be success", async () => {
    const newStatus = userData.status == "active" ? "inactive" : "active";

    logger.info("== STARTING CASE: UPDATE USER ==");
    logger.debug(`ID Params: ${userId}`);
    logger.debug(`Request Body: ${JSON.stringify({ status: newStatus })}`);

    const response = await api
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

  test("DELETE User data should be success", async () => {
    logger.info("== STARTING CASE: DELETE USER ==");
    logger.debug(`ID Params: ${userId}`);

    const response = await api.delete(`/users/${userId}`).set(commonHeaders);
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
    const verifyResponse = await api.get(`/users/${userId}`).set(commonHeaders);
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

describe.only("User Data Validation", () => {
  test("POST User should failed when email duplicated", async () => {
    const userData = generateUser();

    logger.info("== STARTING CASE: CREATE USER WITH DUPLICATED EMAIL ==");
    logger.debug(`Request Body: ${JSON.stringify(userData)}`);

    const firstResponse = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);

    logger.debug(`First Response Status: ${firstResponse.status}`);
    logger.debug(`First Response Body: ${JSON.stringify(firstResponse.body)}`);
    expect(firstResponse.status).toBe(201);

    const secondResponse = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);

    logger.debug(`Second Response Status: ${secondResponse.status}`);
    logger.debug(
      `Second Response Body: ${JSON.stringify(secondResponse.body)}`
    );

    expect(secondResponse.status).toBe(422);
    expect(secondResponse.body[0].field).toBe("email");
    expect(secondResponse.body[0].message).toBe("has already been taken");

    logger.info("Create User successfully failed because email is duplicated");
    logger.info("== END CASE: CREATE USER WITH DUPLICATED EMAIL ==");
  });
});
