import { rand, randEmail, randFirstName, randLastName } from "@ngneat/falso";
import { User } from "../interfaces/user.interface";

const generateUser = (): User => {
  const gender = rand(["male", "female"]) as "male" | "female";
  const firstName = randFirstName({ gender: gender });
  const lastName = randLastName();
  const fullName = `${firstName} ${lastName}`;

  return {
    name: fullName,
    gender: gender,
    email: randEmail({ firstName, lastName, suffix: "com" }).toLowerCase(),
    status: rand(["active", "inactive"]),
  };
};

export default generateUser;
