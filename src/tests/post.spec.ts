import { Response } from "supertest";
import api, { commonHeaders } from "../configs/api.adapter";
import { User } from "../interfaces/user.interface";
import { Post } from "../interfaces/post.interface";

import logger from "../utils/logger";
import generateUser from "../utils/user.generator";
import generatePost from "../utils/post.generator";

describe.only("Feature: User Posts", () => {
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
});
