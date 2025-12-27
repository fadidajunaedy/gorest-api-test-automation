import { Response } from "supertest";
import api, { commonHeaders } from "../configs/api.adapter";
import { User } from "../interfaces/user.interface";
import { Post } from "../interfaces/post.interface";

import logger from "../utils/logger";
import generateUser from "../utils/user.generator";
import generatePost from "../utils/post.generator";

describe("Feature: User Posts", () => {
  let userId: number;

  beforeAll(async () => {
    const userData: User = generateUser();
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    if (response.status !== 201) {
      throw new Error(
        `Setup Failed: Could not create user. Status: ${response.status}`
      );
    }
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    userId = response.body.id;
    logger.info(`Created User with ID: ${userId}`);
  });

  afterAll(async () => {
    if (userId) {
      await api.delete(`/users/${userId}`).set(commonHeaders);
      logger.info(`Deleting User with ID: ${userId}`);
    }
  });

  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== START: "${testName}" ===`);
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== END: "${testName}" ===`);
  });

  test("Should create post successfully using Nested URL (/users/:id/posts)", async () => {
    const postData: Post = generatePost();
    const response: Response = await api
      .post(`/users/${userId}/posts`)
      .set(commonHeaders)
      .send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 201) {
      logger.error(`Create Post fail. Expected 201 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(201);
    expect(response.body.user_id).toBe(userId);
    expect(response.body.title).toBe(postData.title);
    expect(response.body.body).toBe(postData.body);
    logger.info(`Create Post success with ID: ${response.body.user_id}`);
  });

  test("Should create post successfully using Root URL (/posts) with user_id in body", async () => {
    const postData: Post = generatePost(userId);
    const response: Response = await api
      .post(`/posts`)
      .set(commonHeaders)
      .send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 201) {
      logger.error(`Create Post fail. Expected 201 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(201);
    expect(response.body.user_id).toBe(userId);
    expect(response.body.title).toBe(postData.title);
    expect(response.body.body).toBe(postData.body);
    logger.info(`Create Post success with ID: ${response.body.user_id}`);
  });
});

describe.only("Feature: User Posts - Validation", () => {
  let userId: number;

  beforeAll(async () => {
    const userData: User = generateUser();
    const response: Response = await api
      .post("/users")
      .set(commonHeaders)
      .send(userData);
    if (response.status !== 201) {
      throw new Error(
        `Setup Failed: Could not create user. Status: ${response.status}`
      );
    }
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    userId = response.body.id;
    logger.info(`Created User with ID: ${userId}`);
  });

  afterAll(async () => {
    if (userId) {
      await api.delete(`/users/${userId}`).set(commonHeaders);
      logger.info(`Deleting User with ID: ${userId}`);
    }
  });

  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== START: "${testName}" ===`);
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    logger.info(`=== END: "${testName}" ===`);
  });

  test("Should return 422 when user_id in URL does not exist", async () => {
    const postData: Post = generatePost();
    const response: Response = await api
      .post(`/users/999999/posts`)
      .set(commonHeaders)
      .send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(422);
    expect(response.body[0].field).toBe("user");
    expect(response.body[0].message).toBe("must exist");
  });

  test("Should return 422 when user_id in URL with missing body fields", async () => {
    const response: Response = await api
      .post(`/users/${userId}/posts`)
      .set(commonHeaders)
      .send({
        title: null,
        body: null,
      });
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(422);
    expect(response.body[0].field).toBe("title");
    expect(response.body[0].message).toBe("can't be blank");
    expect(response.body[1].field).toBe("body");
    expect(response.body[1].message).toBe("can't be blank");
  });

  test("Should return 422 when user_id in request body does not exist", async () => {
    const postData: Post = generatePost(999999);
    const response: Response = await api
      .post(`/posts`)
      .set(commonHeaders)
      .send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(422);
    expect(response.body[0].field).toBe("user");
    expect(response.body[0].message).toBe("must exist");
  });

  test("Should return 422 when user_id in request body with missing body fields", async () => {
    const response: Response = await api
      .post(`/posts`)
      .set(commonHeaders)
      .send({
        user_id: userId,
        title: null,
        body: null,
      });
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 422) {
      logger.error(`Expected 422 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(Number(response.status)).toBe(422);
    expect(response.body[0].field).toBe("title");
    expect(response.body[0].message).toBe("can't be blank");
    expect(response.body[1].field).toBe("body");
    expect(response.body[1].message).toBe("can't be blank");
  });

  test("Should return 401 when Authentication Token is invalid", async () => {
    const postData: Post = generatePost();
    const response: Response = await api
      .post(`/users/${userId}/posts`)
      .set({
        Authorization: `Bearer 123456`,
        "Content-Type": "application/json",
        Accept: "application/json",
      })
      .send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 401) {
      logger.error(`Expected 401 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
    logger.info(
      "Create User Post successfully failed because token Authorization is invalid"
    );
  });

  test("Should return 401 when Authentication Token is missing", async () => {
    const postData: Post = generatePost(userId);
    const response: Response = await api.post(`/posts`).send(postData);
    logger.debug(`Response Status: ${response.status}`);
    logger.debug(`Response Body: ${JSON.stringify(response.body)}`);
    if (response.status !== 401) {
      logger.error(`Expected 401 but got ${response.status}`);
      logger.error(`Response Body: ${JSON.stringify(response.body)}`);
    }
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication failed");
    logger.info(
      "Create User Post successfully failed because there is no header Authorization"
    );
  });
});
