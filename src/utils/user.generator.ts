import { faker } from "@faker-js/faker";
import { User } from "../interfaces/user.interface";

const generateUser = (): User => {
  const gender = faker.helpers.arrayElement(["male", "female"]);
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName(gender);
  const fullName = `${firstName} ${lastName}`;

  return {
    name: fullName,
    gender: gender,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    status: faker.helpers.arrayElement(["active", "inactive"]),
  };
};

export default generateUser;
