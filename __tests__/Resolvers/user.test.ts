import faker from "faker";

import { UserResponseTC } from "../../src/Resolvers/user";
import { InvalidFieldError, DuplicatedUserError } from "../../src/Errors";
import { UserModel } from "../../src/Models/User";

describe("UserResponseTC", () => {
  describe("register", () => {
    test("When input fields are not valid, should return InvalidFieldError", async () => {
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        phoneNumber: faker.phone.phoneNumber()
      };

      const resolveParams = {
        args: {
          input: fakeUser
        }
      };

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);
      expect(typeof unitUnderTest).toEqual(typeof InvalidFieldError);
      expect(unitUnderTest.isRegistered).toBeFalsy();
      expect(unitUnderTest.errors).toHaveLength(1);
    });

    test("When user already registered, should return DuplicatedUserError", async () => {
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber()
      };
      const resolveParams = {
        args: {
          input: fakeUser
        }
      };
      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid()
      });

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual(DuplicatedUserError);
      jest.clearAllMocks();
    });

    test("When input fields are valid and user have not registered, should return successful", async () => {
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber()
      };
      const resolveParams = {
        args: {
          input: fakeUser
        }
      };
      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      UserModel.create = jest.fn().mockResolvedValueOnce({
        _id: faker.random.uuid(),
        ...fakeUser
      });

      const unitUnderTest = await UserResponseTC.getResolver(
        "register"
      ).resolve(resolveParams);

      expect(unitUnderTest).toStrictEqual({
        isRegistered: true,
        errors: []
      });
      jest.clearAllMocks();
    });
  });
});
