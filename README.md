# GOREST API TEST AUTOMATION

This project contains suites of automated API tests designed for the GoRest public API.

I built this project to demonstrate my capability in architecting a scalable and maintainable backend test automation framework using **Jest**, **Supertest**, and **TypeScript**.

It showcases how I apply the **Separation of Concerns** principle, enforce strict type checking, and handle complex testing scenarios such as dynamic **data seeding** and **data validation**.

## Test Scenarios Coverage

### User Resource

**Feature: User Resource - CRUD Operations**

- Should create a new user successfully with valid data
- Should retrieve user details successfully using valid ID
- Should update user status successfully
- Should delete user successfully and verify non-existence

**Feature: User Resource - Validation**

- Should return 422 when creating a user with a duplicated email
- Should return 422 when 'gender' value is invalid
- Should return 422 when 'status' value is invalid
- Should return 422 when mandatory fields are missing
- Should return 422 when 'email' format is invalid

**Feature: User Resource - Security & Authentication**

- Should return 401 when Authorization header is missing
- Should return 401 when Authorization token is invalid

### User Post

**Feature: User Posts**

- Should create post successfully using Nested URL (/users/:id/posts)
- Should create post successfully using Root URL (/posts) with user_id in body
- Should retrieve list of posts for specific user using Nested URL (/users/:user_id/posts)
- Should retrieve list of posts filtered by user_id using Root URL (/posts?user_id=)

**Feature: User Posts - Validation**

- Should return 422 when user_id does not exist using Nested URL (/users/:id/posts)
- Should return 422 when missing body fields using Nested URL (/users/:id/posts)
- Should return 422 when user_id does not exist using Root URL (/posts)
- Should return 422 when missing body fields using Root URL (/posts)
- Should return 401 when Authentication Token is invalid
- Should return 401 when Authentication Token is missing

## CI/CD Pipeline Note

This project includes a GitHub Actions workflow (`.github/workflows/api-test.yml`).

**Current CI Status:** ❌ HTTP 403 Forbidden

**Root Cause Analysis:**
The GoRest public API implements **IP Filtering** that blocks requests originating from Cloud Data Centers (such as GitHub Actions Runners) to prevent automation abuse.

## Verification

The test suite passes **100% successfully** when executed in a Local Environment (Residential IP).

**Evidence:**
_(Please refer to the screenshots in the `docs/evidence` folder for the local execution report)_
