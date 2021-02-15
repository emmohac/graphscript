import faker from "faker";
import cryptoJS from "crypto";

import { UserResponseTC } from "../../src/Resolvers/user";
import {
  InvalidFieldError,
  DuplicatedUserError,
  UserNotFoundError,
  IncorrectInformation
} from "../../src/Errors";
import { UserModel } from "../../src/Models/User";

describe("UserResponseTC", () => {
  describe("register", () => {
    test("When input fields are not valid, should return InvalidFieldError", async () => {
      const fakeUser = {
        email: faker.internet.exampleEmail(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        phoneNumber: faker.phone.phoneNumberFormat()
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
        phoneNumber: faker.phone.phoneNumberFormat()
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
        phoneNumber: faker.phone.phoneNumberFormat()
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

  describe("login", () => {
    test("When user has not registered before, should return UserNotFoundError", async () => {
      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        }
      };

      UserModel.findOne = jest.fn().mockResolvedValueOnce(null);

      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toStrictEqual(UserNotFoundError);
      jest.clearAllMocks();
    });

    test("When user provides incorrect password, should return IncorrectInformation", async () => {
      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        }
      };

      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        password: "fakePassword",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      });

      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toStrictEqual(IncorrectInformation);
      jest.clearAllMocks();
    });

    test("When user provides correct information, should return successful", async () => {
      const fakePassword = faker.internet.password();
      const resolveParams = {
        args: {
          input: {
            email: faker.internet.email(),
            password: fakePassword
          }
        }
      };

      UserModel.findOne = jest.fn().mockResolvedValueOnce({
        password: cryptoJS
          .createHash("sha256")
          .update(fakePassword)
          .digest("hex"),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      });
      process.env.SECRET_KEY = "test";
      const unitUnderTest = await UserResponseTC.getResolver("login").resolve(
        resolveParams
      );

      expect(unitUnderTest).toMatchObject({
        isAuthenticated: true,
        token: expect.any(String),
        errors: []
      });
      jest.clearAllMocks();
    });
  });
});
